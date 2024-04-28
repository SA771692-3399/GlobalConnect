import React, { useEffect } from "react";
import "./App.css";
import AuthProvider from "./provider/AuthProvider";
// import Routes from "./routes";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import ForgetPassword from "./components/ForgetPassword";
import Logout from "./components/Logout";
import SellerDashboard from "./components/SellersDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import ProtectedSellerRoute from "./components/ProtectedSellerRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import CheckoutPage from "./components/CheckoutPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/seller-register" element={<Register />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
       

        <Route element={<ProtectedUserRoute />}>
          <Route path="/user" element={<Profile />}></Route>
          <Route path="/checkout" element={<CheckoutPage />}></Route>
        </Route>
        <Route element={<ProtectedSellerRoute />}>
          <Route path="/seller-dashboard" element={<SellerDashboard />}></Route>
        </Route>
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />}></Route>
        </Route>
        <Route path="/logout" element={<Logout />}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
