import { UploadFileGateway } from '@/core/domain/gateway/UploadFileGateway'
import { Readable } from 'stream'

type PhotoInput = {
  stream: Readable
  originalName: string
}

export class UploadPhotoUseCase {
  constructor(private readonly uploadFileGateway: UploadFileGateway) {}

  async execute(photos: PhotoInput[]): Promise<string[]> {
    const uploadedFileUrls: string[] = []

    for (const photo of photos) {
      const destinationPath = `photos/${Date.now()}-${photo.originalName}`
      const fileUrl = await this.uploadFileGateway.uploadFile(
        photo.stream,
        photo.originalName,
        destinationPath,
      )
      uploadedFileUrls.push(fileUrl)
    }

    return uploadedFileUrls
  }
}
