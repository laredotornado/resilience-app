import user, { User } from "../User";
import { PERMISSIONS } from ".";

export class UserPermissionsService {
  constructor(private _user: User) {
    console.log(_user);
  }

  public getUserEntitlements(): PERMISSIONS[] {
    return [];
  }
}

export default new UserPermissionsService(user);
