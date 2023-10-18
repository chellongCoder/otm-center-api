import { MobileContext } from '@/auth/authorizationChecker';
import { CreateUserWorkspaceClassesDto } from '@/dtos/create-user-workspace-class.dto';
import { UpdateStatusUserWorkspaceClassesDto } from '@/dtos/update-status-user-workspace-class.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { UserWorkspaceClassTypes, HomeworkStatus } from '@/models/user-workspace-classes.model';
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
  @Authorized([PermissionKeys.STUDENT, PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Get user_workspace_classes list by userWorkspaceId and status' })
  async findByFilter(@QueryParam('userWorkspaceId') userWorkspaceId: number, @QueryParam('status') status: string, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, user_workspace_permission }: MobileContext = req.mobile_context;
    const userWorkspaceIdStudent = user_workspace_permission === PermissionKeys.STAFF ? userWorkspaceId : user_workspace_context.id;
    const data = await this.service.findByFilter(userWorkspaceIdStudent, status as UserWorkspaceClassTypes);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_classes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/class/:classId')
  @Authorized([PermissionKeys.TEACHER, PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Get danh sách học sinh trong lớp học' })
  async getUserWorkspaceByClassId(@Param('classId') classId: number, @QueryParam('search') search: string, @Res() res: any) {
    const data = await this.service.getUserWorkspaceByClassId(classId, search);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/class/homework/list')
  @Authorized([PermissionKeys.STUDENT])
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
  @Authorized([PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Create user_workspace_classes(Ghi danh học viên vào lớp học)' })
  async create(@Body({ required: true }) body: CreateUserWorkspaceClassesDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/detail/:id')
  @Authorized([PermissionKeys.STAFF, PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'update status user_workspace_classes(chuyển trạng thái học của học sinh trong lớp)' })
  async updateDetailStatus(@Param('id') id: number, @Body({ required: true }) body: UpdateStatusUserWorkspaceClassesDto, @Res() res: any) {
    const data = await this.service.updateDetailStatus(id, body);
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
