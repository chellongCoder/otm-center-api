import { UpdateUserWorkspaceDto } from '@/dtos/update-user-workspace.dto';
import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { UserWorkspacesService } from '@/services/user-workspaces.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspaces')
export class UserWorkspacesController {
  constructor(public service: UserWorkspacesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get user_workspaces list' })
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
  @OpenAPI({ summary: 'Get user_workspaces by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create user_workspaces' })
  async create(@Body({ required: true }) body: UserWorkspaces, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update user_workspaces' })
  async update(@Param('id') id: number, @Body({ required: true }) body: UpdateUserWorkspaceDto, @Res() res: any) {
    const data = await this.service.update(id, body);
    return successResponse({ res, data, status_code: 200 });
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user_workspaces' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
