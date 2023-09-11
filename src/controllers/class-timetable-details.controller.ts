import { MobileContext } from '@/auth/authorizationChecker';
import { UpdateEvaluationInLessonDto } from '@/dtos/update-evaluation-student-in-lesson.dto';
import { UpdateClassTimetableDetailMarkingDto } from '@/dtos/updateClassTimetableDetailMarking.dto';
import { UpdateFinishAssignmentDto } from '@/dtos/updateFinishAssignment.dto';
import { UpdateStudentAttendanceDto } from '@/dtos/updateStudentAttentdance.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { ClassTimetableDetailsService } from '@/services/class-timetable-details.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/class_timetable_details')
export class ClassTimetableDetailsController {
  constructor(public service: ClassTimetableDetailsService) {}

  @Get('/')
  @Authorized()
  @OpenAPI({ summary: 'Get class_timetable_details list' })
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
  @Authorized()
  @OpenAPI({ summary: 'Get class_timetable_details by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/timetable/:timetableId')
  @Authorized()
  @OpenAPI({ summary: 'Get thông tin màn điểm danh' })
  async getAttendances(@Param('timetableId') timetableId: number, @QueryParam('search') search: string, @Res() res: any) {
    const data = await this.service.getAttendances(timetableId, search);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/finish_assignment')
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Trả bài tập về nhà' })
  async finishAssignment(@Body({ required: true }) body: UpdateFinishAssignmentDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.finishAssignment(body, user_workspace_context, workspace_context);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/student_attendance')
  @Authorized()
  @OpenAPI({ summary: 'Điểm danh học sinh' })
  async updateStudentAttendance(@Body({ required: true }) body: UpdateStudentAttendanceDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.updateStudentAttendance(body, user_workspace_context.id);
    return successResponse({ res, data, status_code: 201 });
  }

  @Post('/student_evaluation')
  @Authorized()
  @OpenAPI({ summary: 'Đánh giá hàng ngày học sinh' })
  async updateEvaluationStudentInLesson(@Body({ required: true }) body: UpdateEvaluationInLessonDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.updateEvaluationStudentInLesson(body, user_workspace_context.id);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/marking/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update homeworkAssessment and homeworkScore' })
  async updateClassTimetableDetailMarking(
    @Param('id') id: number,
    @Body({ required: true }) body: UpdateClassTimetableDetailMarkingDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.updateClassTimetableDetailMarking(id, body, user_workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update class_timetable_details' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete class_timetable_details' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
