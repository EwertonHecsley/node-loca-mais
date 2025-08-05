import { UploadFileGateway } from "@/core/domain/gateway/UploadFileGateway";
import { BadRequest } from "@/shared/errors/custom/BadRequest";
import logger from "@/shared/utils/logger";
import { Storage } from '@google-cloud/storage';
import path from "path";

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

    async uploadFile(filePath: string, destinationPath: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const file = path.basename(filePath);

        logger.info(`Uploading file to bucket ${this.bucketName} at path ${destinationPath}`);

        await bucket.upload(filePath, {
            destination: destinationPath
        });

        logger.info(`File ${file} uploaded to ${this.bucketName}/${destinationPath} successfully`);

        const fileUrl = `https://storage.googleapis.com/${this.bucketName}/${destinationPath}`;
        return fileUrl;
    }
}