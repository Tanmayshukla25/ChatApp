import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from './UserContext';


function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to={`/login?referer=${location.pathname}`} replace />;
  }

  return children;
}
export default ProtectedRoute;