import { Files } from '@/models/files.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { MinioClient } from '@/utils/minio';

@Service()
export class FilesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Files.findByCond({
      sort: orderCond.sort,
      order: orderCond.order,
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
      search: QueryParser.toFilters(search),
    });
    return {
      data: filteredData[0],
      total: filteredData[1],
      pages: Math.ceil(filteredData[1] / limit),
    };
  }

  /**
   * findById
   */
  public async findById(id: number) {
    return Files.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Files) {
    const results = await Files.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Files) {
    return Files.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Files.delete(id);
  }
  public async uploadFile(file: any) {
    try {
      if (!file) {
        throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
      }
      const uploadedFile = await MinioClient.getInstance().upload(file);
      const result = {
        originalFile: file.originalname,
        url: uploadedFile?.url,
      };
      const newFile = new Files();
      newFile.originalName = file.originalname;
      newFile.name = uploadedFile ? uploadedFile.fileName : '';
      newFile.url = uploadedFile ? uploadedFile.url : '';
      await newFile.save();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
