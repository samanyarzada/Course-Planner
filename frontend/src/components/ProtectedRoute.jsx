import { Navigate } from "react-router-dom";

// Shows the page only when the user is logged in
function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;