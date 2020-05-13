import { isEmpty, isLoaded } from "react-redux-firebase";
import routes, { IRoute, IRoutes } from "../routes";
import ROUTE_PERMISSIONS from "../RoutePermissions";
import { IPermissionSet, IRoutePermissions } from "./utils";
import { PERMISSIONS } from "../../model";
import userPermissionsService, {
  USER_ROLES,
  UserPermissionsService,
} from "../../model/permissions/UserPermissionsService";

export class RoutingService {
  private _auth: AuthState = {};

  private _isAuthenticated(): boolean {
    console.log("AUTH", this._auth);
    return isLoaded(this._auth) && !isEmpty(this._auth);
  }

  private _verifyPermissions(
    userPermissions: PERMISSIONS[],
    requiredPermissions: IPermissionSet,
    route: IRoute
  ): IRouteEntitlement[] {
    const entitlements: IRouteEntitlement[] = [];
    for (let p in requiredPermissions) {
      if (requiredPermissions.hasOwnProperty(p)) {
        const permission: PERMISSIONS = p as PERMISSIONS;
        let entitlement: IRouteEntitlement;
        switch (permission) {
          case PERMISSIONS.PUBLIC:
            entitlement = {
              route,
              permissionGranted: true,
            };
            break;
          case PERMISSIONS.AUTHENTICATED:
            const isAuthenticated: boolean = this._isAuthenticated();
            entitlement = {
              route: isAuthenticated ? route : this._routes.login,
              permissionGranted: isAuthenticated,
            };
            break;
          default:
            entitlement = {
              route: this._routes.home,
              permissionGranted: false,
            };
        }
        entitlements.push(entitlement);
      }
    }
    if (entitlements.length === 0) {
      // User is trying to access route we haven't set permissions for (=｀ω´=)
      entitlements.push({
        route: this._routes.pageNotFound,
        permissionGranted: false,
      });
    }
    return entitlements;
  }

  constructor(
    private _routes: IRoutes,
    private _routePermissions: IRoutePermissions,
    private _userPermissions: UserPermissionsService
  ) {
    console.log("ROUTER PERMISSIONS", _routePermissions);
  }

  public useAuth(auth: AuthState): RoutingService {
    this._auth = auth;
    return this;
  }

  public canAccessRoute(route: IRoute): IRouteEntitlement {
    const requiredPermissions: IPermissionSet = this._routePermissions[route] as IPermissionSet;

    this._userPermissions
      .useAuth(this._auth)
      .getUserEntitlements()
      .then((userPermissions: PERMISSIONS[]) => {
        console.log("USER PERMISSIONS", userPermissions);
        console.log("REQUIRED PERMISSIONS", requiredPermissions);

        const verifyPermissions: IRouteEntitlement[] = this._verifyPermissions(
          userPermissions,
          requiredPermissions,
          route
        );
        console.log("Verification result:", verifyPermissions);
        const violation: IRouteEntitlement | undefined = verifyPermissions.find(
          (routeEntitlement: IRouteEntitlement) => !routeEntitlement.permissionGranted
        );
        const permissionGranted: boolean = violation === undefined;
        const result: IRouteEntitlement = {
          route: permissionGranted ? route : (violation as IRouteEntitlement).route,
          permissionGranted,
        };
        console.log(result);
      });
    return {
      route: route,
      permissionGranted: true,
    };
  }
}
export interface IRouteEntitlement {
  route: IRoute;
  permissionGranted: boolean;
}
export interface AuthState {
  isLoaded?: boolean;
  isEmpty?: boolean;
}
export default new RoutingService(routes, ROUTE_PERMISSIONS, userPermissionsService);
