import HomePage from '../pages/UserPage/UserHome.js';
import { Navigate } from 'react-router';
import LoginPage from '../pages/Auth/login.js';
import RegisterPage from '../pages/Auth/register.js';
import JobDetail from '../pages/UserPage/JobDetail.js'
import CompanyDetail from '../pages/UserPage/CompanyDetail.js'
import JobHistory from '../pages/UserPage/JobHistory.js';
import Profile from '../pages/UserPage/Profile.js';
import NotFound from '../pages/Other/NotFound.js'

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
    path: '/404',
    element: < NotFound/>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default USER_ROUTES;