import React from "react";
import "./App.css";
import AuthProvider from "./provider/AuthProvider";
// import Routes from "./routes";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
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
import Register2 from "./components/Registration2";
import Feedbacks from "./components/Feedbacks";
import Home2 from "./components/Home2";
import Products from "./components/Products";
import Productfb from "./components/Productfb";
import Productwish from "./components/Productwish";
import WishList from "./components/WishList";
import BlogPage from "./components/BlogPage";
import Fqa from "./components/Fqa";
import OrderSummary from "./components/OrderSummary";

function App() {
  const getDefaultRoute = () => {
    let role = localStorage?.getItem("Role")?.toLowerCase();

    if (role == "admin") return "/admin";
    if (role == "seller" || role == "localowner") return "/seller-dashboard";
    if (role == "user") return "/user";
  };

  return (
    <AuthProvider>
      <Routes>
        {localStorage?.getItem("token") ? (
          <>
            <Route element={<ProtectedUserRoute />}>
              <Route path="/user" element={<Profile />}></Route>
              <Route path="/Productwish/:id" element={<Productwish />}></Route>
              <Route path="/Productfb/:id" element={<Productfb />}></Route>
              <Route path="/checkout" element={<CheckoutPage />}></Route>
              <Route path="/order-summary" element={<OrderSummary />}></Route>
              <Route path="/WishList" element={<WishList />}></Route>
            </Route>
            <Route element={<ProtectedSellerRoute />}>
              <Route
                path="/seller-dashboard"
                element={<SellerDashboard />}
              ></Route>
            </Route>
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />}></Route>
            </Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route
              path="*"
              element={<Navigate to={getDefaultRoute()} replace={true} />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Home2 />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/seller-register" element={<Register />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/registers" element={<Register2 />}></Route>
            <Route path="/forget-password" element={<ForgetPassword />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/feedbacks" element={<Feedbacks />}></Route>
            <Route path="/Blogs" element={<BlogPage />}></Route>
            <Route path="/FaQs" element={<Fqa />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route path="*" element={<Login />}></Route>
          </>
        )}
      </Routes>
    </AuthProvider>
  );
}

export default App;
