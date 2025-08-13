import { DeleteFileGateway } from '@/core/domain/gateway/DeleteFileGateway'
import { GetFileGateway } from '@/core/domain/gateway/GetFileGateway'
import { InternalServerErrorException } from '@/shared/errors/custom/InternalServerErrorException'
import { NotFound } from '@/shared/errors/custom/NotFound'
import logger from '@/shared/utils/logger'

export class DeletePhoto {
  constructor(
    private readonly deleteFileGateway: DeleteFileGateway,
    private readonly getFileGateway: GetFileGateway,
  ) {}

  async execute(filePath: string) {
    try {
      const exist = await this.getFileGateway.getFile(filePath)
      if (!exist) throw new NotFound()
      await this.deleteFileGateway.deleteFile(filePath)
    } catch (error) {
      logger.error(`Error Internal: ${error}`)
      throw new InternalServerErrorException()
    }
  }
}
