import { MobileContext } from '@/auth/authorizationChecker';
import { CreateFavoriteDto } from '@/dtos/create-favorite.dto';
import { successResponse } from '@/helpers/response.helper';
import { FavoriteUserWorkspaces } from '@/models/favorite-user-workspaces.model';
import { FavoriteUserWorkspacesService } from '@/services/favorite-user-workspaces.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/favorite_user_workspaces')
export class FavoriteUserWorkspacesController {
  constructor(public service: FavoriteUserWorkspacesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get favorite_user_workspaces list' })
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
  @OpenAPI({ summary: 'Get favorite_user_workspaces by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create favorite_user_workspaces' })
  async create(@Body({ required: true }) body: CreateFavoriteDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update favorite_user_workspaces' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete favorite_user_workspaces' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
