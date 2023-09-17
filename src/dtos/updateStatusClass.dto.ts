import { StatusClasses } from '@/models/classes.model';
import { IsIn, IsString } from 'class-validator';

export class UpdateStatusClassDto {
  @IsString()
  @IsIn([StatusClasses.ACTIVE, StatusClasses.CANCEL, StatusClasses.DONE, StatusClasses.EXPIRED, StatusClasses.INACTIVE])
  status: StatusClasses;
}
