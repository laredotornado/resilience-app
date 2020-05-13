import { PERMISSIONS } from "../model";
import { addPermissionsToRoutes, IRoutePermissions } from "./services/utils";
import routes, { IRoute } from "./routes";

const RoutePermissions: IRoutePermissions = {};

const publicOnlyRoutes: IRoute[] = [
  routes.home,
  routes.about,
  routes.donate,
  routes.login,
  routes.organizer.signup,
  routes.request.start,
  routes.request.foodbox,
  routes.request.success,
  routes.request.error,
  routes.user.signup,
  routes.unauthorized,
];

const authenticatedRoutes: IRoute[] = [
  routes.organizer.dashboard.home,
  routes.missions.createdByUser,
  routes.missions.createNew,
  routes.missions.completed,
  routes.missions.feedback,
  routes.missions.details,
  routes.missions.main,
  routes.organizer.dashboard.home,
  routes.organizer.dashboard.missions,
  routes.organizer.dashboard.recipients,
  routes.organizer.dashboard.volunteers,
  routes.user.profile,
  routes.volunteer.status,
];

// Public routes
addPermissionsToRoutes([PERMISSIONS.PUBLIC], publicOnlyRoutes, RoutePermissions);

// Authenticated routes
addPermissionsToRoutes([PERMISSIONS.AUTHENTICATED], authenticatedRoutes, RoutePermissions);

// Mission-related routes
addPermissionsToRoutes([PERMISSIONS.VIEW_MISSIONS], [
    routes.missions.main,
    routes.missions.details,
    routes.missions.createdByUser,
    routes.missions.completed,
    routes.missions.feedback,
  ], RoutePermissions);
addPermissionsToRoutes([PERMISSIONS.CREATE_NEW_MISSIONS], [
    routes.missions.createNew
  ], RoutePermissions);

// Organizers-related routes
addPermissionsToRoutes([PERMISSIONS.VIEW_ORGANIZER_DASHBOARD], [
    routes.organizer.dashboard.home
  ], RoutePermissions);
addPermissionsToRoutes([PERMISSIONS.VIEW_ALL_MISSIONS], [
    routes.organizer.dashboard.missions
  ], RoutePermissions);
addPermissionsToRoutes([PERMISSIONS.VIEW_ALL_RECIPIENTS], [
    routes.organizer.dashboard.recipients
  ], RoutePermissions);
addPermissionsToRoutes([PERMISSIONS.VIEW_ALL_VOLUNTEERS], [
    routes.organizer.dashboard.volunteers
  ], RoutePermissions);

export default RoutePermissions;
