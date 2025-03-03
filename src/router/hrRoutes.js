import { Navigate } from 'react-router';
import DashboardPage from '../pages/HrDashBoard/DashboardPage';
import JobPage from '../pages/HrDashBoard/JobPage';
import ResumePage from '../pages/HrDashBoard/ResumePage';
import ProPage from '../pages/HrDashBoard/ProPage';
import PaymentPage from '../pages/Other/PaymentPage';
import ProtectedRoute from './protectedRouter.js';
import CreateCompanyForm from '../pages/HrDashBoard/CreateCompany.js';

const DASHBOARD_ROUTER = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/job',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <JobPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/resume',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <ResumePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/pro',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <ProPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-company',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <CreateCompanyForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment',
    element: <PaymentPage />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default DASHBOARD_ROUTER;