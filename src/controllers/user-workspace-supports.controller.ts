import { MobileContext } from '@/auth/authorizationChecker';
import { UserWorkspaceSupportDto } from '@/dtos/create-user-workspace-support.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { SupportTypes } from '@/models/user-workspace-supports.model';
import { UserWorkspaceSupportsService } from '@/services/user-workspace-supports.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_supports')
export class UserWorkspaceSupportsController {
  constructor(public service: UserWorkspaceSupportsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get user_workspace_supports list' })
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

  @Get('/detail/:id')
  @OpenAPI({ summary: 'Get user_workspace_supports by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/list')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_supports by id' })
  async getListByUserWorkspace(@Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getListByUserWorkspace(user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized([PermissionKeys.STUDENT, PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Create user_workspace_supports' })
  async create(@Body({ required: true }) body: UserWorkspaceSupportDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context, user_workspace_permission }: MobileContext = req.mobile_context;
    let supportType: SupportTypes = SupportTypes.STUDENT;
    if (user_workspace_permission === PermissionKeys.TEACHER) {
      supportType = SupportTypes.TEACHER;
    }
    const data = await this.service.create(body, user_workspace_context.id, workspace_context.id, supportType);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update user_workspace_supports' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user_workspace_supports' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
