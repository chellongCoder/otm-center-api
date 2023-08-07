import { UserWorkspaces } from '@/models/user-workspaces.model';

export interface UserWorkspacesToken extends Partial<UserWorkspaces> {
  accessToken: string;
  refreshToken: string;
}
