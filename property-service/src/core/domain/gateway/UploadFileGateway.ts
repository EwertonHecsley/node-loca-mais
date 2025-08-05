export abstract class UploadFileGateway {
    abstract uploadFile(filePath: string, destinationPath: string): Promise<string>;
}