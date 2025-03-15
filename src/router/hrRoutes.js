import { Navigate } from 'react-router';
import DashboardPage from '../pages/HrDashBoard/DashboardPage';
import JobPage from '../pages/HrDashBoard/JobPage';
import ResumePage from '../pages/HrDashBoard/ResumePage';
import ProPage from '../pages/HrDashBoard/ProPage';
import PaymentPage from '../pages/Other/PaymentPage';
import ProtectedRoute from './protectedRouter.js';
import PaymentSuccess from '../pages/Other/PaymentSuccess.js';
import PaymentHistory from '../pages/HrDashBoard/PaymentHistory.js';
import CandidateSuggestions from '../pages/HrDashBoard/CandidateSuggestions.js';

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
    path: '/dashboard/payment-history',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <PaymentHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/candidates',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <CandidateSuggestions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <PaymentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/success',
    element: (
      <ProtectedRoute requiredRole="HR_ROLE">
        <PaymentSuccess />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default DASHBOARD_ROUTER;