import { MobileContext } from '@/auth/authorizationChecker';
import { caches } from '@/caches';
import { CACHE_PREFIX } from '@/caches/constants';
import { CheckShiftClassroomValidDto } from '@/dtos/check-shift-classroom-valid.dto';
import { CreateClassScheduleDto } from '@/dtos/create-user-workspace-shift-scope.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { UserWorkspaceShiftScopesService } from '@/services/user-workspace-shift-scopes.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_shift_scopes')
export class UserWorkspaceShiftScopesController {
  constructor(public service: UserWorkspaceShiftScopesService) {}

  @Get('/')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_shift_scopes list' })
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

  @Get('/teaching_schedule')
  @Authorized()
  @OpenAPI({ summary: 'Get teaching schedule' })
  async getTeachingSchedule(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @QueryParam('userWorkspaceId') userWorkspaceId: number,
    @QueryParam('workspaceId') workspaceId: number,
    @QueryParam('fromDate') fromDate: number,
    @QueryParam('toDate') toDate: number,
    @Res() res: any,
    @Req() req: any,
  ) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;

    let data: any;
    const cacheKey = [
      CACHE_PREFIX.CACHE_DASHBOARD,
      'teaching_schedule',
      page,
      limit,
      order,
      search,
      userWorkspaceId || user_workspace_context.id,
      workspaceId || workspace_context.id,
      fromDate,
      toDate,
    ].join(`_`);
    const cacheData = await caches().getCaches(cacheKey);

    if (cacheData) {
      data = cacheData;
    } else {
      data = await this.service.getTeachingSchedule(
        page,
        limit,
        order,
        search,
        userWorkspaceId || user_workspace_context.id,
        workspaceId || workspace_context.id,
        fromDate,
        toDate,
      );
      await caches().setCache(cacheKey, data);
    }
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/teaching_dashboard')
  @Authorized([PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Get teaching dashboard home screen' })
  async getTeachingDashboard(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('userWorkspaceId') userWorkspaceId: number,
    @QueryParam('workspaceId') workspaceId: number,
    @QueryParam('currentDate') currentDate: number,
    @Res() res: any,
    @Req() req: any,
  ) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;

    let data: any;
    const cacheKey = [
      CACHE_PREFIX.CACHE_DASHBOARD,
      'teaching_dashboard',
      workspaceId || workspace_context.id,
      userWorkspaceId || user_workspace_context.id,
      currentDate,
      page,
      limit,
      order,
    ].join(`_`);
    const cacheData = await caches().getCaches(cacheKey);

    if (cacheData) {
      data = cacheData;
    } else {
      data = await this.service.getTeachingDashboard(
        page,
        limit,
        order,
        userWorkspaceId || user_workspace_context.id,
        workspaceId || workspace_context.id,
        currentDate,
      );
      await caches().setCache(cacheKey, data);
    }

    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get user_workspace_shift_scopes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  // @Post('/')
  // @Authorized()
  // @OpenAPI({ summary: 'Create 1 user_workspace_shift_scopes' })
  // async create(@Body({ required: true }) body: UserWorkspaceShiftScopes, @Res() res: any) {
  //   const data = await this.service.create(body);
  //   return successResponse({ res, data, status_code: 201 });
  // }

  @Post('/create_class_schedule')
  @Authorized()
  @OpenAPI({ summary: 'Create user_workspace_shift_scopes flow business(sau khi cập nhật lịch học cần cập nhật lại thời khoá biểu)' })
  async createClassSchedule(@Body({ required: true }) body: CreateClassScheduleDto, @Res() res: any) {
    const data = await this.service.createClassSchedule(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Post('/check_shift_classroom')
  @Authorized()
  @OpenAPI({ summary: 'Check shift classroom validate' })
  async checkShiftClassroom(@Body({ required: true }) body: CheckShiftClassroomValidDto, @Res() res: any) {
    console.log('chh_log ---> create ---> body:', body);
    console.log('chh_log ---> create ---> res:', res);
    // const data = await this.service.checkShiftClassrooms(body);
    // return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update user_workspace_shift_scopes' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete user_workspace_shift_scopes' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
