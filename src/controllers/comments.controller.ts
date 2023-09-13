import { MobileContext } from '@/auth/authorizationChecker';
import { CreateCommentsDto } from '@/dtos/create-comments.dto';
import { UpdateCommentsDto } from '@/dtos/update-comments.dto';
import { successResponse } from '@/helpers/response.helper';
import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';
import { CommentsService } from '@/services/comments.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/comments')
export class CommentsController {
  constructor(public service: CommentsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get comments list' })
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
  @Authorized()
  @OpenAPI({ summary: 'Get comments list' })
  async getListComments(@QueryParam('targetKey') targetKey: string, @QueryParam('category') category: string, @Res() res: any, @Req() req: any) {
    const { workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getListComments(targetKey, category, workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/detail/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get comments by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create comments' })
  async create(@Body({ required: true }) body: CreateCommentsDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update comments' })
  async update(@Param('id') id: number, @Body({ required: true }) body: UpdateCommentsDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.update(id, body, user_workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete comments' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
