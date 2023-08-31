import { MobileContext } from '@/auth/authorizationChecker';
import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaceClassTypes, UserWorkspaceClasses, HomeworkStatus } from '@/models/user-workspace-classes.model';
import { UserWorkspaceClassesService } from '@/services/user-workspace-classes.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_classes')
export class UserWorkspaceClassesController {
  constructor(public service: UserWorkspaceClassesService) {}

  @Get('/')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_classes list' })
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

  @Get('/list')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_classes list by userWorkspaceId and status' })
  async findByFilter(@QueryParam('userWorkspaceId') userWorkspaceId: number, @QueryParam('status') status: string, @Res() res: any) {
    const data = await this.service.findByFilter(userWorkspaceId, status as UserWorkspaceClassTypes);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_classes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/class/homework')
  @Authorized()
  @OpenAPI({ summary: 'Get homework of class by status are DONE or NOT_DONE' })
  async getHomeworkOfClass(
    @QueryParam('userWorkspaceId') userWorkspaceId: number,
    @QueryParam('workspaceId') workspaceId: number,
    @QueryParam('classId') classId: number,
    @QueryParam('status') status: string,
    @Res() res: any,
    @Req() req: any,
  ) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getHomeworkOfClass({
      userWorkspaceId: userWorkspaceId || user_workspace_context.id,
      workspaceId: workspaceId || workspace_context.id,
      status: status as HomeworkStatus,
      classId,
    });
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create user_workspace_classes(Ghi danh học viên vào lớp học)' })
  async create(@Body({ required: true }) body: UserWorkspaceClasses, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update user_workspace_classes' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete user_workspace_classes' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
