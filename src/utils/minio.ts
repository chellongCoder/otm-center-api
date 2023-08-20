// import { Client } from 'minio';
// import config from 'config';
// import { HttpMessages } from '@/exceptions/http-messages.constant';

// import { File } from '@/models/file.model';
// import { HttpException } from '@/exceptions/http-exception';
// import { convertToURL } from './slug';
// const bucket = 'jlpt';
// const url = `https://minio.2soft.top/${bucket}/`;
// export class MinioClient {
//   private minioClient: Client | null = null;
//   private static instance: MinioClient | null = null;
//   private constructor() {
//     this.minioClient = new Client({
//       endPoint: config.get('minio.endPoint'),
//       useSSL: true,
//       accessKey: config.get('minio.accessKey'),
//       secretKey: config.get('minio.secretKey'),
//     });
//   }

//   public static getInstance() {
//     if (this.instance) return this.instance;
//     return new MinioClient();
//   }

//   public async upload(item: Express.Multer.File) {
//     if (this.minioClient) {
//       const fileName = convertToURL(new Date().getTime() + '-' + item.originalname);
//       console.log('fileName: ' + fileName);
//       await this.minioClient.putObject(bucket, fileName, item.buffer, item.size, { 'content-type': item.mimetype });
//       return {
//         fileName,
//         url: `${url}${fileName}`,
//       };
//     }
//     return null;
//   }

//   public async remove(fileName: string): Promise<{
//     success: boolean;
//     message: string;
//   } | null> {
//     try {
//       if (!this.minioClient) throw new HttpException(400, HttpMessages._BAD_REQUEST);
//       await this.minioClient.removeObject(bucket, fileName);
//       return { success: true, message: HttpMessages._DELETED };
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   }

//   public async downloadFile(fileUrl: string) {
//     try {
//       if (!this.minioClient) throw new HttpException(400, HttpMessages._BAD_REQUEST);
//       const getFile = await File.findOne({
//         where: {
//           url: fileUrl,
//         },
//       });
//       if (!getFile) throw new HttpException(404, HttpMessages._NOT_FOUND);
//       await this.minioClient.fGetObject(bucket, getFile.name, getFile.name);
//       return getFile.name;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   }
// }
