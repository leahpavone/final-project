import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../utilities/firebase";

const PrivateRoute = () => {
  return auth.currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
