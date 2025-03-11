import { Navigate } from 'react-router';
import DashboardPage from '../pages/AdminPage/DashboardPage';
import CompanyPage from '../pages/AdminPage/CompanyPage';
import UserPage from '../pages/AdminPage/UserPage';
import JobPage from '../pages/AdminPage/JobPage';
import ResumePage from '../pages/AdminPage/ResumePage';
import PermissionPage from '../pages/AdminPage/PermissionPage';
import RolePage from '../pages/AdminPage/RolePage';
import ProtectedRoute from './protectedRouter.js';
import PaymentTransaction from '../pages/AdminPage/PaymentTransaction.js';

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
    path: '/admin/payment-transaction',
    element: (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <PaymentTransaction />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
];

export default ADMIN_ROUTER;