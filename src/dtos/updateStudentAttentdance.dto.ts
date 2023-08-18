import { AttendanceStatus } from '@/models/class-timetable-details.model';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class UserWorkspaceAttendances {
  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id: student are updated status', example: 6 })
  userWorkspaceId: number;

  @IsString()
  @JSONSchema({ description: 'StatusUserWorkspaces', example: AttendanceStatus.ON_TIME })
  status: AttendanceStatus;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'note attentdance', example: 'Dịch tiếng anh' })
  note?: string;
}

export class UpdateStudentAttendanceDto {
  @IsNumber()
  @JSONSchema({ description: 'timetable id', example: 143 })
  timetableId: number;

  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id: teacher update status', example: 7 })
  userWorkspaceId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'summary attendance note', example: 'Học sinh cả lớp đi đúng giờ' })
  attendanceNote?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link and note assignment' })
  @Type(() => UserWorkspaceAttendances)
  userWorkspaceAttendances: UserWorkspaceAttendances[];
}
