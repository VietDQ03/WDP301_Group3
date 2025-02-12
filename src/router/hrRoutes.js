import { Navigate } from 'react-router';
import DashboardPage from '../pages/HrDashBoard/DashboardPage';
import JobPage from '../pages/HrDashBoard/JobPage';
import ResumePage from '../pages/HrDashBoard/ResumePage';
import ProPage from '../pages/HrDashBoard/ProPage';
import PaymentPage from '../pages/Other/PaymentPage';

const DASHBOARD_ROUTER = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/job',
    element: <JobPage />,
  },
  {
    path: '/dashboard/resume',
    element: <ResumePage />,
  },
  {
    path: '/dashboard/pro',
    element: <ProPage />,
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