import { UserWorkspaces } from '@/models/user-workspaces.model';
import { Action } from 'routing-controllers';
// import { Connection } from 'typeorm';

export function currentUserChecker(): (action: Action) => Promise<UserWorkspaces | undefined> {
  return async function innerCurrentUserChecker(action: Action): Promise<UserWorkspaces | undefined> {
    return action.request.user;
  };
}
