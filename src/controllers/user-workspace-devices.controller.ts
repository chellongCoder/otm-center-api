import { MobileContext } from '@/auth/authorizationChecker';
import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';
import { UserWorkspaceDevicesService } from '@/services/user-workspace-devices.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_devices')
export class UserWorkspaceDevicesController {
  constructor(public service: UserWorkspaceDevicesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get user_workspace_devices list' })
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
  @OpenAPI({ summary: 'Get user_workspace_devices by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create user_workspace_devices' })
  async create(@Body({ required: true }) body: UserWorkspaceDevices, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update user_workspace_devices' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user_workspace_devices' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
