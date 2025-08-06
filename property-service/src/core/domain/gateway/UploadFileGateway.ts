import { Readable } from 'stream'

export abstract class UploadFileGateway {
  abstract uploadFile(stream: Readable, fileName: string, destinationPath: string): Promise<string>
}
