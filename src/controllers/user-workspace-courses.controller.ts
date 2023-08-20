import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaceCourses } from '@/models/user-workspace-courses.model';
import { UserWorkspaceCoursesService } from '@/services/user-workspace-courses.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_courses')
export class UserWorkspaceCoursesController {
  constructor(public service: UserWorkspaceCoursesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get user_workspace_courses list' })
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
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_courses by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create user_workspace_courses' })
  async create(@Body({ required: true }) body: UserWorkspaceCourses, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update user_workspace_courses' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete user_workspace_courses' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
