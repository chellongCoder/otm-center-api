import { MobileContext } from '@/auth/authorizationChecker';
import { caches } from '@/caches';
import { CACHE_PREFIX } from '@/caches/constants';
import { TTLTime } from '@/constants';
import { CreatePostDto } from '@/dtos/create-post.dto';
import { UpdatePostDto } from '@/dtos/update-post.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { PostsService } from '@/services/posts.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/posts')
export class PostsController {
  constructor(public service: PostsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get posts list' })
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
  @OpenAPI({ summary: 'Get posts by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized([PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Create posts' })
  async create(@Body({ required: true }) body: CreatePostDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context, workspace_context);

    await caches().removeCacheWithRelation(CACHE_PREFIX.CACHE_POST, `${workspace_context.id}`);
    return successResponse({ res, data, status_code: 201 });
  }

  @Get('/newsfeed/list')
  @Authorized([PermissionKeys.TEACHER, PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Get posts by id' })
  async getNewsfeed(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @Res() res: any,
    @QueryParam('isPin') isPin: boolean,
    @Req() req: any,
  ) {
    const { user_workspace_context, user_workspace_permission, workspace_context }: MobileContext = req.mobile_context;
    let data: any;
    const cacheKey = [CACHE_PREFIX.CACHE_POST, user_workspace_context.id, isPin, page, limit, workspace_context.id, user_workspace_permission].join(
      `_`,
    );
    const cacheData = await caches().getCaches(cacheKey);
    if (cacheData) {
      return successResponse({ res, data: cacheData, status_code: 200 });
    }

    if (user_workspace_permission === PermissionKeys.TEACHER) {
      data = await this.service.getNewsfeedTeacher(user_workspace_context.id, isPin, workspace_context.id, page, limit);
    } else {
      data = await this.service.getNewsfeed(user_workspace_context.id, isPin, workspace_context.id, page, limit);
    }

    await caches().setCache(cacheKey, data, TTLTime.day);
    return successResponse({ res, data, status_code: 200 });
  }
  @Put('/:id')
  @Authorized([PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Update posts' })
  async update(@Param('id') id: number, @Body({ required: true }) body: UpdatePostDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.update(id, body, user_workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Delete('/:id')
  @Authorized([PermissionKeys.TEACHER])
  @OpenAPI({ summary: 'Delete posts' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
