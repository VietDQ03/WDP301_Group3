import HomePage from '../pages/UserPage/UserHome.js';
import { Navigate } from 'react-router';
import LoginPage from '../pages/Auth/login.js';
import RegisterPage from '../pages/Auth/register.js';
import JobDetail from '../components/UserPage/JobDetail.js'
import CompanyDetail from '../components/UserPage/CompanyDetail.js'
import JobHistory from '../pages/UserPage/JobHistory.js';
import Profile from '../pages/UserPage/Profile.js';
import NotFound from '../pages/Other/NotFound.js'
import Introduce from '../pages/UserPage/Introduce.js';
import ChangePassword from '../pages/Other/ChangePassword.js';
import ForgotPassword from '../pages/UserPage/ForgotPassword.js';
import QuickApply from '../pages/UserPage/QuickApply.js';
import CreateCV from '../pages/Other/CreateCV.js';
import CreateCompany from '../pages/Other/CreateCompany.js';

const USER_ROUTES = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/jobhistory',
    element: <JobHistory />
  },
  {
    path: '/job/:id',
    element: <JobDetail />
  },
  {
    path: '/companies/:id',
    element: <CompanyDetail />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: < RegisterPage/>,
  },
  {
    path: '/introduce',
    element: < Introduce/>,
  },
  {
    path: '/create-cv',
    element: < CreateCV/>,
  },
  {
    path: '/404',
    element: < NotFound/>,
  },
  {
    path: '/forgot-password',
    element: < ForgotPassword />,
  },
  {
    path: '/become-hr',
    element: < CreateCompany />,
  },
  {
    path: '/quick-apply',
    element: <QuickApply />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default USER_ROUTES;