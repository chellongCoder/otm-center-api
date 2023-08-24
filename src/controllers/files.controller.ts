import { successResponse } from '@/helpers/response.helper';
import { Files } from '@/models/files.model';
import { SingleUpload } from '@/schema-interfaces/upload/single-upload';
import { UploadFileResponse } from '@/schema-interfaces/upload/upload-file';
import { FilesService } from '@/services/files.service';
import { Express } from 'express';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res, UploadedFile } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/files')
export class FilesController {
  constructor(public service: FilesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get files list' })
  async findAll(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @Res() res: any,
  ) {
    const data = await this.service.findAll(page, limit, order, search);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get files by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create files' })
  async create(@Body({ required: true }) body: Files, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Post('/upload')
  @OpenAPI({ summary: 'Upload a single file' })
  @ResponseSchema(UploadFileResponse)
  @SingleUpload('file')
  async uploadImage(@UploadedFile('file') file: any, @Res() res: any) {
    const data = await this.service.uploadFile(file);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update files' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete files' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
