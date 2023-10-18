import { ClassScheduleTypes } from '@/models/user-workspace-classes.model';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateUserWorkspaceClassesDto {
  @IsNumber()
  @JSONSchema({ description: 'userWorkspaceId of student add to class', example: 1 })
  userWorkspaceId: number;

  @IsNumber()
  @JSONSchema({ description: 'classId is id of classes table to add student', example: 1 })
  classId: number;

  @IsString()
  @JSONSchema({ description: 'fromTime is date student start in class ex: 2023-08-05', example: '2023-08-05' })
  fromDate: string;

  @IsString()
  @IsOptional()
  @IsIn([ClassScheduleTypes.ALL, ClassScheduleTypes.SPECIAL], { each: true })
  @JSONSchema({
    description: 'type of class schedule is apply all date of week => ALL or apply special date of week => SPECIAL',
    example: ClassScheduleTypes.ALL,
  })
  classScheduleType: ClassScheduleTypes;
}
