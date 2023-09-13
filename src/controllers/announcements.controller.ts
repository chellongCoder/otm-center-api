import { MobileContext } from '@/auth/authorizationChecker';
import { CreateAnnouncementDto } from '@/dtos/create-annountcement.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { AnnouncementsService } from '@/services/announcements.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/announcements')
export class AnnouncementsController {
  constructor(public service: AnnouncementsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get announcements list' })
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
  @Authorized([PermissionKeys.STUDENT, PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Get announcements list' })
  async getList(@QueryParam('isImportant') isImportant: boolean, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getList(user_workspace_context, isImportant);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/detail/:id')
  @OpenAPI({ summary: 'Get announcements by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized([PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Create announcements' })
  async create(@Body({ required: true }) body: CreateAnnouncementDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context, workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update announcements' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete announcements' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
