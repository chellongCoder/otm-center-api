import { Curriculums } from '@/models/curriculums.model';
import { CurriculumsService } from '@/services/curriculums.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/curriculums')
export class CurriculumsController {
  constructor(public service: CurriculumsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get curriculums list' })
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
  @OpenAPI({ summary: 'Get curriculums by id' })
  async findById(@Param('id') id: number) {
    try {
      return this.service.findById(id);
    } catch (error) {
      return { error };
    }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create curriculums' })
  async create(@Body({ required: true }) body: Curriculums) {
    try {
      return this.service.create(body);
    } catch (error) {
      return { error };
    }
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update curriculums' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete curriculums' })
  async delete(@Param('id') id: number) {
    try {
      return this.service.delete(id);
    } catch (error) {
      return { error };
    }
  }
}
