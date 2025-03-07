import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './router';
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/slices/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  
    if (token) {
      console.log("Token nhận được:", token); // Kiểm tra xem có token không
      localStorage.setItem("access_token", token);
      navigate("/", { replace: true }); 
    } else {
      console.log("Không tìm thấy token trong URL");
    }
  }, [navigate]);
  
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