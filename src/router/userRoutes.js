import HomePage from '../pages/UserPage/UserHome.js';
import { Navigate } from 'react-router';
import LoginPage from '../pages/Auth/login.js';
import RegisterPage from '../pages/Auth/register.js';
import JobDetail from '../pages/UserPage/JobDetail.js'
import CompanyDetail from '../pages/UserPage/CompanyDetail.js'
const USER_ROUTES = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/jobhistory',
    element: <HomePage />
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
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default USER_ROUTES;