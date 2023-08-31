import { AbsentStatus } from '@/models/appliance-absents.model';
import { IsIn, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class UpdateStatusApplianceAbsentsDto {
  @IsString()
  @IsIn([AbsentStatus.APPROVED, AbsentStatus.CANCEL, AbsentStatus.NOT_APPROVED_YET, AbsentStatus.REJECTED], { each: true })
  @JSONSchema({ description: 'AbsentStatus: APPROVED || REJECTED || CANCEL || NOT_APPROVED_YET ', example: 'APPROVED' })
  status: AbsentStatus;
}
