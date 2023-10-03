import { MobileContext } from '@/auth/authorizationChecker';
import { CreateClassDto } from '@/dtos/create-class.dto';
import { UpdateStatusClassDto } from '@/dtos/updateStatusClass.dto';
import { successResponse } from '@/helpers/response.helper';
import { Classes, StatusClasses } from '@/models/classes.model';
import { PermissionKeys } from '@/models/permissions.model';
import { ClassesService } from '@/services/classes.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/classes')
export class ClassesController {
  constructor(public service: ClassesService) {}

  @Get('/')
  @Authorized()
  @OpenAPI({ summary: 'Get classes list' })
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

  @Get('/owner-teacher')
  @Authorized()
  @OpenAPI({ summary: 'Get lớp học' })
  async getOwnerClasses(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @QueryParam('status', { type: 'string' }) status: StatusClasses,
    @Res() res: any,
  ) {
    const data = await this.service.findAllClasses(page, limit, order, search, status);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/by_date')
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Get lớp học với buổi học theo ngày' })
  async GetClassTimetableByDate(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @QueryParam('status', { type: 'string' }) status: StatusClasses,
    @Res() res: any,
  ) {
    // WIP 28/08
    const data = await this.service.GetClassTimetableByDate(page, limit, order, search, status);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get classes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id/schedule')
  @Authorized()
  @OpenAPI({ summary: 'Get lịch học của lớp' })
  async getClassSchedule(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.getClassSchedule(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id/student_schedule')
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Get lịch học của học sinh' })
  async getClassStudentSchedule(@Param('id') id: number, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getClassStudentSchedule(id, user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized([PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Create classes' })
  async create(@Body({ required: true }) body: CreateClassDto, @Res() res: any, @Req() req: any) {
    const { workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/detail/:id')
  @Authorized([PermissionKeys.TEACHER, PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Update classes status' })
  async updateDetail(@Param('id') id: number, @Body({ required: true }) body: UpdateStatusClassDto, @Res() res: any) {
    const data = await this.service.updateDetail(id, body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete classes' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
