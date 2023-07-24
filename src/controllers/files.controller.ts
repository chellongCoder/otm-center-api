import { Files } from '@/models/files.model';
import { FilesService } from '@/services/files.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
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
  ) {
    try {
      return this.service.findAll(page, limit, order, search);
    } catch (error) {
      return { error };
    }
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get files by id' })
  async findById(@Param('id') id: number) {
    try {
      return this.service.findById(id);
    } catch (error) {
      return { error };
    }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create files' })
  async create(@Body({ required: true }) body: Files) {
    try {
      return this.service.create(body);
    } catch (error) {
      return { error };
    }
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
  async delete(@Param('id') id: number) {
    try {
      return this.service.delete(id);
    } catch (error) {
      return { error };
    }
  }
}