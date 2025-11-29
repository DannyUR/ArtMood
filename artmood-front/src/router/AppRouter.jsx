import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import UserDashboard from "../pages/user/UserDashboard";
import EditProfile from "../pages/user/EditProfile";
import MyWorks from "../pages/user/MyWorks";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";

import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* USER */}
                <Route
                    path="/user/dashboard"
                    element={
                        <UserRoute>
                            <UserDashboard />
                        </UserRoute>
                    }
                />

                {/* ADMIN */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}
