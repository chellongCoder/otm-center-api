import { Classrooms } from '@/models/classrooms.model';
import { ClassroomsService } from '@/services/classrooms.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/classrooms')
export class ClassroomsController {
  constructor(public service: ClassroomsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get classrooms list' })
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
  @OpenAPI({ summary: 'Get classrooms by id' })
  async findById(@Param('id') id: number) {
    try {
      return this.service.findById(id);
    } catch (error) {
      return { error };
    }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create classrooms' })
  async create(@Body({ required: true }) body: Classrooms) {
    try {
      return this.service.create(body);
    } catch (error) {
      return { error };
    }
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update classrooms' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete classrooms' })
  async delete(@Param('id') id: number) {
    try {
      return this.service.delete(id);
    } catch (error) {
      return { error };
    }
  }
}
