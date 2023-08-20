import { UpdateEvaluationInLessonDto } from '@/dtos/update-evaluation-student-in-lesson.dto';
import { UpdateClassTimetableDetailMarkingDto } from '@/dtos/updateClassTimetableDetailMarking.dto';
import { UpdateFinishAssignmentDto } from '@/dtos/updateFinishAssignment.dto';
import { UpdateStudentAttendanceDto } from '@/dtos/updateStudentAttentdance.dto';
import { successResponse } from '@/helpers/response.helper';
import { ClassTimetableDetailsService } from '@/services/class-timetable-details.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/class_timetable_details')
export class ClassTimetableDetailsController {
  constructor(public service: ClassTimetableDetailsService) {}

  @Get('/')
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
  @OpenAPI({ summary: 'Get class_timetable_details by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/timetable/:timetableId')
  @OpenAPI({ summary: 'Get thông tin màn điểm danh' })
  async getAttendances(@Param('timetableId') timetableId: number, @QueryParam('search') search: string, @Res() res: any) {
    const data = await this.service.getAttendances(timetableId, search);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/finish_assignment')
  @OpenAPI({ summary: 'Trả bài tập về nhà' })
  async finishAssignment(@Body({ required: true }) body: UpdateFinishAssignmentDto, @Res() res: any) {
    const data = await this.service.finishAssignment(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/student_attendance')
  @OpenAPI({ summary: 'Điểm danh học sinh' })
  async updateStudentAttendance(@Body({ required: true }) body: UpdateStudentAttendanceDto, @Res() res: any) {
    const data = await this.service.updateStudentAttendance(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/student_evaluation')
  @OpenAPI({ summary: 'Đánh giá hàng ngày học sinh' })
  async updateEvaluationStudentInLesson(@Body({ required: true }) body: UpdateEvaluationInLessonDto, @Res() res: any) {
    const data = await this.service.updateEvaluationStudentInLesson(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/marking/:id')
  @OpenAPI({ summary: 'Update homeworkAssessment and homeworkScore' })
  async updateClassTimetableDetailMarking(
    @Param('id') id: number,
    @Body({ required: true }) body: UpdateClassTimetableDetailMarkingDto,
    @Res() res: any,
  ) {
    const data = await this.service.updateClassTimetableDetailMarking(id, body);
    return successResponse({ res, data, status_code: 200 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update class_timetable_details' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete class_timetable_details' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
