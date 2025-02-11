import ADMIN_ROUTES from './adminRoutes';
import USER_ROUTES from './userRoutes';
import DASHBOARD_ROUTES from './hrRoutes';

const ROUTES = {
  admin: ADMIN_ROUTES,
  user: USER_ROUTES,
  hr: DASHBOARD_ROUTES,
};

export default ROUTES;