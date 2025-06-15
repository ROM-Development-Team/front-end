import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Login from "./features/auth/login/Login.tsx";
import Forgot from "./features/auth/forgot/forgot.tsx";
import Register from "./features/auth/register/Register.tsx";
import Reset from "./features/auth/reset/reset.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </Router>
  );
};

export default App;
