import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? <Navigate to="/" /> : children;
};

export default PublicRoute;
