import { UpdateExerciseClassLessonDto } from '@/dtos/update-exercise-class-lesson.dto';
import { successResponse } from '@/helpers/response.helper';
import { ClassLessons } from '@/models/class-lessons.model';
import { ClassLessonsService } from '@/services/class-lessons.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/class_lessons')
export class ClassLessonsController {
  constructor(public service: ClassLessonsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get class_lessons list' })
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
  @OpenAPI({ summary: 'Get class_lessons by id' })
  async findById(@Param('id') id: number, @QueryParam('userWorkspaceId') userWorkspaceId: number, @Res() res: any) {
    console.log('chh_log ---> findById ---> userWorkspaceId:', userWorkspaceId);
    console.log('chh_log ---> findById ---> id:', id);
    const data = await this.service.findById(id, userWorkspaceId);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/class/:classId')
  @OpenAPI({ summary: 'Get homework by classId' })
  async getHomeworkByClassId(
    @Param('classId') classId: number,
    @QueryParam('workspaceId') workspaceId: number,
    @QueryParam('search') search: string,
    @Res() res: any,
  ) {
    const data = await this.service.getHomeworkByClassId(classId, workspaceId, search);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create class_lessons' })
  async create(@Body({ required: true }) body: ClassLessons, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/exercise/:id')
  @OpenAPI({ summary: 'Update class_lessons in class' })
  async updateExercise(@Param('id') id: number, @Body({ required: true }) body: UpdateExerciseClassLessonDto, @Res() res: any) {
    const data = await this.service.updateExercise(id, body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update class_lessons' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete class_lessons' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
