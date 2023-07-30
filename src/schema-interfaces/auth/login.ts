import { UserWorkspacesToken } from '@/interfaces/user-workspace-token';
import { Users } from '@/models/users.model';
import { Workspaces } from '@/models/workspaces.model';
import { IsObject } from 'class-validator';

export class LoginResponse {
  @IsObject()
  users: Users;

  @IsObject()
  userWorkspaces: UserWorkspacesToken;

  @IsObject()
  workspaces: Workspaces;
}
