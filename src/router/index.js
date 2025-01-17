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

export const menuConfig = [
  {
    key: '/',
    label: 'Dashboard',
    icon: 'DashboardOutlined',
  },
  {
    key: '/company',
    label: 'Company',
    icon: 'TeamOutlined',
  },
  {
    key: '/user',
    label: 'User',
    icon: 'UserOutlined',
  },
  {
    key: '/job',
    label: 'Job',
    icon: 'FileOutlined',
  },
  {
    key: '/resume',
    label: 'Resume',
    icon: 'FileOutlined',
  },
  {
    key: '/permission',
    label: 'Permission',
    icon: 'LockOutlined',
  },
  {
    key: '/role',
    label: 'Role',
    icon: 'SafetyCertificateOutlined',
  },
];

const ROUTER = [
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/company/*',
    element: <CompanyPage />,
  },
  {
    path: '/user/*',
    element: <UserPage />,
  },
  {
    path: '/job',
    element: <JobPage />,
  },
  {
    path: '/resume',
    element: <ResumePage />,
  },
  {
    path: '/permission',
    element: <PermissionPage />,
  },
  {
    path: '/role',
    element: <RolePage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default ROUTER;