import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const hasAccess = user?.user_id && user?.token;

  return hasAccess ? children : <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;
