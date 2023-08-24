import { Client } from 'minio';
import config from 'config';

import { convertToURL } from './util';
import { Files } from '@/models/files.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

const bucket = 'jlpt';
const url = `https://minio.2soft.top/${bucket}/`;
export class MinioClient {
  private minioClient: Client | null = null;
  private static instance: MinioClient | null = null;
  private constructor() {
    this.minioClient = new Client({
      endPoint: config.get('minio.endPoint'),
      useSSL: true,
      accessKey: config.get('minio.accessKey'),
      secretKey: config.get('minio.secretKey'),
    });
  }

  public static getInstance() {
    if (this.instance) return this.instance;
    return new MinioClient();
  }

  public async upload(item: any) {
    if (this.minioClient) {
      const fileName = convertToURL(new Date().getTime() + '-' + item.originalname);
      await this.minioClient.putObject(bucket, fileName, item.buffer, item.size, { 'content-type': item.mimetype });
      return {
        fileName,
        url: `${url}${fileName}`,
      };
    }
    return null;
  }

  public async remove(fileName: string): Promise<{
    success: boolean;
  } | null> {
    try {
      if (!this.minioClient) throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
      await this.minioClient.removeObject(bucket, fileName);
      return { success: true };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async downloadFile(fileUrl: string) {
    try {
      if (!this.minioClient) {
        throw new Exception(ExceptionName.SERVICE_CONNECT_FAIL, ExceptionCode.SERVICE_CONNECT_FAIL);
      }
      const getFile = await Files.findOne({
        where: {
          url: fileUrl,
        },
      });
      if (!getFile) throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
      await this.minioClient.fGetObject(bucket, getFile.originalName, getFile.originalName);
      return getFile.originalName;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
