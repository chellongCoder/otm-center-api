import { GroupPermissions } from '@/models/group-permissions.model';
import { GroupPermissionsService } from '@/services/group-permissions.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/group_permissions')
export class GroupPermissionsController {
  constructor(public service: GroupPermissionsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get group_permissions list' })
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
  @OpenAPI({ summary: 'Get group_permissions by id' })
  async findById(@Param('id') id: number) {
    try {
      return this.service.findById(id);
    } catch (error) {
      return { error };
    }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create group_permissions' })
  async create(@Body({ required: true }) body: GroupPermissions) {
    try {
      return this.service.create(body);
    } catch (error) {
      return { error };
    }
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update group_permissions' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete group_permissions' })
  async delete(@Param('id') id: number) {
    try {
      return this.service.delete(id);
    } catch (error) {
      return { error };
    }
  }
}
