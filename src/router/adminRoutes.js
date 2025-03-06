// src/router/index.jsx
import { Navigate } from 'react-router';
import DashboardPage from '../pages/AdminPage/DashboardPage';
import CompanyPage from '../pages/AdminPage/CompanyPage';
import UserPage from '../pages/AdminPage/UserPage';
import JobPage from '../pages/AdminPage/JobPage';
import ResumePage from '../pages/AdminPage/ResumePage';
import PermissionPage from '../pages/AdminPage/PermissionPage';
import RolePage from '../pages/AdminPage/RolePage';
import ProtectedRoute from './protectedRouter.js';
import CreateCompanyForm from '../pages/HrDashBoard/CreateCompany.js';

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
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/company/*',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <CompanyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/user/*',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <UserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/job',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <JobPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/resume',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <ResumePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/permission',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <PermissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/role',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <RolePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-company',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <CreateCompanyForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
];

export default ADMIN_ROUTER;