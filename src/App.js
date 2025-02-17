import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './router';
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/slices/auth";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {ROUTES.user.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      {ROUTES.admin.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      {ROUTES.hr.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default App;