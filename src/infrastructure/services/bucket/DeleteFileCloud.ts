import { DeleteFileGateway } from '@/core/domain/gateway/DeleteFileGateway'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import logger from '@/shared/utils/logger'
import { Storage } from '@google-cloud/storage'
import { GetFileCloud } from './GetFileCloud'
import { NotFound } from '@/shared/errors/custom/NotFound'

export class DeleteFileCloud implements DeleteFileGateway {
  private readonly storage: Storage
  private readonly bucketName: string
  private readonly getFileService: GetFileCloud

  constructor() {
    this.storage = new Storage()
    this.bucketName = String(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)
    if (!this.bucketName) {
      throw new BadRequest('GOOGLE_CLOUD_STORAGE_BUCKET environment variable is not set')
    }
    this.getFileService = new GetFileCloud()
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const exists = await this.getFileService.getFile(filePath)
      if (!exists) {
        logger.warn(`File: ${filePath} not found.`)
        throw new NotFound(`File not found: ${filePath}`)
      }
      const bucket = this.storage.bucket(this.bucketName)
      const file = bucket.file(filePath)

      logger.info(`Deletando arquivo ${filePath} do bucket ${this.bucketName}`)

      await file.delete()
      logger.info(`Arquivo ${filePath} deletado com sucesso do bucket ${this.bucketName}`)
    } catch (error) {
      logger.error(`Erro ao deletar arquivo do Google Cloud Storage: ${error}`)
      throw new BadRequest('Erro ao deletar arquivo do armazenamento em nuvem')
    }
  }
}
