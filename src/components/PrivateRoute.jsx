import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
