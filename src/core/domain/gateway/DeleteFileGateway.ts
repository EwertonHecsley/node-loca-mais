export abstract class DeleteFileGateway {
  abstract deleteFile(filePath: string): Promise<void>
}
