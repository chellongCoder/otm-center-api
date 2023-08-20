// import { HttpMessages } from '@/exceptions/http-messages.constant';
// import { File } from '@/models/file.model';
// import { MinioClient } from '@/utils/minio';
// import { Response } from 'express';
// import { Service } from 'typedi';

// @Service()
// export class FileService {
//   async uploadFile(file: Express.Multer.File, res: Response): Promise<Response> {
//     try {
//       if (!file) return res.status(400).json({ success: false, message: HttpMessages._BAD_REQUEST });
//       console.log('uploading');
//       const uploadedFile = await MinioClient.getInstance().upload(file);
//       const result = {
//         originalFile: file.originalname,
//         url: uploadedFile?.url,
//       };
//       const newFile = new File();
//       newFile.originalName = file.originalname;
//       newFile.name = uploadedFile ? uploadedFile.fileName : '';
//       newFile.url = uploadedFile ? uploadedFile.url : '';
//       await newFile.save();
//       return res.json({ success: true, message: HttpMessages._FILE_UPLOADED, result });
//     } catch (error) {
//       console.log(error);
//       return res.status(400).json({ success: false, message: HttpMessages._FILE_NOT_UPLOADED });
//     }
//   }
// }
