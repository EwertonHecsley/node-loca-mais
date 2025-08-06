import { UploadFileGateway } from "@/core/domain/gateway/UploadFileGateway";
import { BadRequest } from "@/shared/errors/custom/BadRequest";
import logger from "@/shared/utils/logger";
import { Storage } from '@google-cloud/storage';
import { Readable } from "stream";

export class UploadFileCloud implements UploadFileGateway {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage();
    this.bucketName = String(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    if (!this.bucketName) {
      throw new BadRequest("GOOGLE_CLOUD_STORAGE_BUCKET environment variable is not set");
    }
  }

  async uploadFile(
    stream: Readable,
    filename: string,
    destinationPath: string
  ): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(destinationPath);

      logger.info(`Fazendo upload do arquivo ${filename} para ${this.bucketName}/${destinationPath}`);

      await new Promise<void>((resolve, reject) => {
        const writeStream = file.createWriteStream({
          resumable: false,
          contentType: 'auto',
          public: true,
        });

        stream.pipe(writeStream)
          .on('error', (err) => {
            logger.error(`Erro no stream: ${err}`);
            reject(err);
          })
          .on('finish', resolve);
      });

      await file.makePublic();

      logger.info(`Arquivo ${filename} enviado com sucesso para ${destinationPath}`);

      return `https://storage.googleapis.com/${this.bucketName}/${destinationPath}`;
    } catch (error) {
      logger.error(`Erro ao fazer upload para o Google Cloud Storage: ${error}`);
      throw new BadRequest("Erro ao enviar arquivo para o armazenamento em nuvem");
    }
  }
}
