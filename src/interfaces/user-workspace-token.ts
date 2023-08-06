import { UserWorkspaces } from '@/models/user-workspaces.model';

export interface UserWorkspacesToken extends UserWorkspaces {
  accessToken: string;
  refreshToken: string;
}
