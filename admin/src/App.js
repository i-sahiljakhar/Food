// import React from "react";
// import Navbar from "./components/Navbar/Navbar";
// import Sidebar from "./components/Sidebar/Sidebar";
// import { Routes, Route } from "react-router-dom";
// import Add from "./pages/Add/Add";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import List from "./pages/List/List";
// import Orders from "./pages/Orders/Orders";
// import 'bootstrap/dist/css/bootstrap.min.css'
// function App() {
//   const url = "http://localhost:5000";

//   return (
//     <div>
//       <ToastContainer />
//       <Navbar />
//       <hr />
//       <div className="app-content">
//         <Sidebar />
//         <Routes>
//           <Route path="/add" element={<Add url={url} />} />
//           <Route path="/list" element={<List url={url} />} />
//           <Route path="/orders" element={<Orders url={url} />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const url = "http://localhost:5000";

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
                            <Add url={url} />
                        </ProtectedRoute>
                    } />
                    <Route path="/list" element={
                        <ProtectedRoute>
                            <List url={url} />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <Orders url={url} />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/orders" replace />} />
                </Routes>
            </div>
        </AdminContextProvider>
    );
}

export default App;