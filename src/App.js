import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './router';

const App = () => {
  return (
    <Routes>
      {ROUTES.user.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      {ROUTES.admin.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default App;