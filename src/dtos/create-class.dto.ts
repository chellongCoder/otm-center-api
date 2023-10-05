import { StatusClasses } from '@/models/classes.model';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateClassDto {
  @IsString()
  @JSONSchema({ description: 'name', example: 'ten lop hoc' })
  name: string;

  @IsNumber()
  @JSONSchema({ description: 'id khoá học của lớp áp dụng', example: 1 })
  courseId: number;

  @IsString()
  @JSONSchema({ description: 'fromTime is date start class ex: 2023-08-05', example: '2023-08-05' })
  fromTime: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'toTime is date end class is optional ex: 2024-08-05', example: '2024-08-05' })
  toTime: string;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'số buổi Đã học', example: 6 })
  attendedNumber: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'Số buổi giáo viên Việt Nam', example: 6 })
  sessionOfVietnameseTeacher: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'Số buổi giáo viên nước ngoài', example: 6 })
  sessionOfForeignTeacher: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'Số HV tối đa', example: 6 })
  maximumStudent: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'Số HV tối đa mỗi buổi', example: 6 })
  maximumStudentSession: number;

  @IsString()
  @JSONSchema({ description: 'mã của lớp học', example: 'IELTS_class_599835' })
  code: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'ghi chú lớp học', example: 'note lop hoc' })
  note: string;

  @IsString()
  @IsOptional()
  @IsIn([StatusClasses.ACTIVE, StatusClasses.CANCEL, StatusClasses.DONE, StatusClasses.EXPIRED, StatusClasses.INACTIVE], { each: true })
  @JSONSchema({ description: 'trạng thái lớp', example: StatusClasses.ACTIVE })
  status: StatusClasses;

  @IsNumber()
  @JSONSchema({ description: 'loại đánh giá hàng ngày áp dụng cho lớp', example: 1 })
  dailyEvaluationId: number;
}
