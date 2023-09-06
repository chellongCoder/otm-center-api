import { MobileContext } from '@/auth/authorizationChecker';
import { ApplianceAbsentsDto } from '@/dtos/create-appliance-absent.dto';
import { UpdateStatusApplianceAbsentsDto } from '@/dtos/update-status-appliance-absent.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { ApplianceAbsentsService } from '@/services/appliance-absents.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/appliance_absents')
export class ApplianceAbsentsController {
  constructor(public service: ApplianceAbsentsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get appliance_absents list' })
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
  @OpenAPI({ summary: 'Get appliance_absents by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/student/list')
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Get appliance_absents list of student' })
  async getListStudentApplianceAbsents(@Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getListStudentApplianceAbsents(user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/teacher/list')
  @Authorized([PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Get appliance_absents list of teacher' })
  async getListTeacherApplianceAbsents(@QueryParam('classId') classId: number, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getListTeacherApplianceAbsents(user_workspace_context.id, workspace_context.id, classId);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Gửi đơn báo nghỉ' })
  async create(@Body({ required: true }) body: ApplianceAbsentsDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context, workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized([PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Xác nhận đơn xin nghỉ' })
  async updateStatus(@Param('id') id: number, @Body({ required: true }) body: UpdateStatusApplianceAbsentsDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.updateStatus(id, body, user_workspace_context.id);
    return successResponse({ res, data, status_code: 201 });
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete appliance_absents' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
