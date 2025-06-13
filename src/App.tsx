import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/login.tsx";
import Forgot from "./pages/auth/forgot.tsx";
/** import Register from "./pages/auth/register.tsx"; **/
import Reset from "./pages/auth/reset.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </Router>
  );
};

export default App;
