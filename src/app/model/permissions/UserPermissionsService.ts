import user, { User } from "../User";
import { PERMISSIONS } from ".";
import { UserInterface } from "../schema";
import { organizerEntitlements, userEntitlements, volunteerEntitlements } from "./UserEntitlements";

export enum USER_ROLES {
  ORGANIZER = "ORGANIZER",
  VOLUNTEER = "VOLUNTEER",
  USER = "USER",
  ANONYMOUS = "ANONYMOUS",
}

export class UserPermissionsService {
  private _auth: AuthState = null;
  private _role: USER_ROLES | undefined;
  private _userPermissions: { [permissions: string]: PERMISSIONS } = {};

  private _setPermissions(permissions: PERMISSIONS[]): void {}

  constructor(private _user: User) {
    console.log(_user);
  }

  public useAuth(auth: AuthState): UserPermissionsService {
    this._auth = auth;
    return this;
  }

  public getRole(): Promise<USER_ROLES> {
    if (this._auth) {
      return this._user.getUserProfile(this._auth.uid).then((userInfo: UserInterface) => {
        console.log("USER INFO", userInfo);
        if (userInfo.isOrganizer) {
          this._role = USER_ROLES.ORGANIZER;
        } else if (userInfo.isVolunteer) {
          this._role = USER_ROLES.VOLUNTEER;
        } else {
          this._role = USER_ROLES.USER;
        }
        return this._role;
      });
    } else {
      this._role = USER_ROLES.ANONYMOUS;
      return Promise.resolve(this._role);
    }
  }

  public getUserEntitlements(): Promise<PERMISSIONS[]> {
    return this.getRole().then((role: USER_ROLES) => {
      console.log("ROLE:", this._role);
      switch (this._role) {
        case USER_ROLES.ORGANIZER:
          return organizerEntitlements;
        case USER_ROLES.VOLUNTEER:
          return volunteerEntitlements;
        case USER_ROLES.USER:
          return userEntitlements;
        case USER_ROLES.ANONYMOUS:
        default:
          return [PERMISSIONS.PUBLIC];
      }
    });
  }
}
type AuthState = any;

export default new UserPermissionsService(user);
