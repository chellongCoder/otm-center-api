import { CheckShiftClassroomDto } from '@/dtos/check-shift-classroom-valid.dto';
import { CreateClassScheduleDto } from '@/dtos/create-user-workspace-shift-scope.dto';
import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { UserWorkspaceShiftScopesService } from '@/services/user-workspace-shift-scopes.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_shift_scopes')
export class UserWorkspaceShiftScopesController {
  constructor(public service: UserWorkspaceShiftScopesService) {}

  @Get('/')
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
  @OpenAPI({ summary: 'Get user_workspace_shift_scopes list' })
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
  ) {
    const data = await this.service.getTeachingSchedule(page, limit, order, search, userWorkspaceId, workspaceId, fromDate, toDate);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get user_workspace_shift_scopes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  // @Post('/')
  // @OpenAPI({ summary: 'Create 1 user_workspace_shift_scopes' })
  // async create(@Body({ required: true }) body: UserWorkspaceShiftScopes, @Res() res: any) {
  //   const data = await this.service.create(body);
  //   return successResponse({ res, data, status_code: 201 });
  // }

  @Post('/create_class_schedule')
  @OpenAPI({ summary: 'Create user_workspace_shift_scopes flow business' })
  async createClassSchedule(@Body({ required: true }) body: CreateClassScheduleDto, @Res() res: any) {
    const data = await this.service.createClassSchedule(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Post('/check_shift_classroom')
  @OpenAPI({ summary: 'Check shift classroom validate' })
  async checkShiftClassroom(@Body({ required: true }) body: CheckShiftClassroomDto, @Res() res: any) {
    console.log('chh_log ---> create ---> body:', body);
    console.log('chh_log ---> create ---> res:', res);
    // const data = await this.service.checkShiftClassrooms(body);
    // return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update user_workspace_shift_scopes' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user_workspace_shift_scopes' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
