import { MobileContext } from '@/auth/authorizationChecker';
import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import { UserWorkspaceNotificationsService } from '@/services/user-workspace-notifications.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res, Authorized } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_notifications')
export class UserWorkspaceNotificationsController {
  constructor(public service: UserWorkspaceNotificationsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get user_workspace_notifications list' })
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
  @OpenAPI({ summary: 'Get user_workspace_notifications by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/list')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_notifications list' })
  async getListNotification(@QueryParam('page') page: number, @QueryParam('limit') limit: number, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getListNotification(user_workspace_context.id, workspace_context.id, page, limit);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create user_workspace_notifications' })
  async create(@Body({ required: true }) body: UserWorkspaceNotifications, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update status user_workspace_notifications' })
  async update(@Param('id') id: number, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.update(id, user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 201 });
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user_workspace_notifications' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
