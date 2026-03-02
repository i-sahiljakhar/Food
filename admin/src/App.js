import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Login from "./pages/Login/Login";
import AdminContextProvider from "./context/AdminContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <AdminContextProvider>
            <ToastContainer />
            <Navbar />
            <hr />
            <div className="app-content">
                <Sidebar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/add" element={
                        <ProtectedRoute>
                            <Add />
                        </ProtectedRoute>
                    } />
                    <Route path="/list" element={
                        <ProtectedRoute>
                            <List />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/orders" replace />} />
                </Routes>
            </div>
        </AdminContextProvider>
    );
}

export default App;