export abstract class GetFileGateway {
  abstract getFile(filePath: string): Promise<boolean>
}
