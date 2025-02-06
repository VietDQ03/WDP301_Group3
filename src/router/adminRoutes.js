// src/router/index.jsx
import { Navigate } from 'react-router';
import DashboardPage from '../pages/AdminPage/DashboardPage';
import CompanyPage from '../pages/AdminPage/CompanyPage';
import UserPage from '../pages/AdminPage/UserPage';
import JobPage from '../pages/AdminPage/JobPage';
import ResumePage from '../pages/AdminPage/ResumePage';
import PermissionPage from '../pages/AdminPage/PermissionPage';
import RolePage from '../pages/AdminPage/RolePage';

// // Company routes
// import CompanyList from '../pages/company/CompanyList';
// import CompanyDetail from '../pages/company/CompanyDetail';
// import CompanyCreate from '../pages/company/CompanyCreate';
// import CompanyEdit from '../pages/company/CompanyEdit';

// // User routes
// import UserList from '../pages/user/UserList';
// import UserDetail from '../pages/user/UserDetail';
// import UserCreate from '../pages/user/UserCreate';
// import UserEdit from '../pages/user/UserEdit';

const ADMIN_ROUTER = [
  {
    path: '/admin',
    element: <DashboardPage />,
  },
  {
    path: '/admin/company/*',
    element: <CompanyPage />,
  },
  {
    path: '/admin/user/*',
    element: <UserPage />,
  },
  {
    path: '/admin/job',
    element: <JobPage />,
  },
  {
    path: '/admin/resume',
    element: <ResumePage />,
  },
  {
    path: '/admin/permission',
    element: <PermissionPage />,
  },
  {
    path: '/admin/role',
    element: <RolePage />,
  },
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
];

export default ADMIN_ROUTER;