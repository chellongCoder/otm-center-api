import { UserWorkspaceClassTypes } from '@/models/user-workspace-classes.model';
import { IsIn, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class UpdateStatusUserWorkspaceClassesDto {
  @IsString()
  @IsIn(
    [
      UserWorkspaceClassTypes.UNLEARNED,
      UserWorkspaceClassTypes.STUDYING,
      UserWorkspaceClassTypes.RESERVE,
      UserWorkspaceClassTypes.DROPOUT,
      UserWorkspaceClassTypes.DONE,
      UserWorkspaceClassTypes.CHANGE,
    ],
    { each: true },
  )
  @JSONSchema({ description: 'UNLEARNED || STUDYING || RESERVE || DROPOUT || DONE || CHANGE ||', example: UserWorkspaceClassTypes.STUDYING })
  status: UserWorkspaceClassTypes;
}
