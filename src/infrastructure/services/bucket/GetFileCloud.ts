import { GetFileGateway } from '@/core/domain/gateway/GetFileGateway'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { Storage } from '@google-cloud/storage'

export class GetFileCloud implements GetFileGateway {
  private readonly storage: Storage
  private readonly bucketName: string

  constructor() {
    this.storage = new Storage()
    this.bucketName = String(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)
    if (!this.bucketName) {
      throw new BadRequest('GOOGLE_CLOUD_STORAGE_BUCKET environment variable is not set')
    }
  }

  async getFile(filePath: string): Promise<boolean> {
    const [exists] = await this.storage.bucket(this.bucketName).file(filePath).exists()
    return exists
  }
}
