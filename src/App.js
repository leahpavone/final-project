import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileDetails from "./pages/ProfileDetails";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/dashboard" element={<PrivateRoute />}> */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* </Route> */}
        {/* <Route path="/profile-details" element={<PrivateRoute />}> */}
        <Route
          path="/profile-details"
          element={
            <PrivateRoute>
              <ProfileDetails />
            </PrivateRoute>
          }
        />
        {/* </Route> */}
        <Route path="/search" element={<Search />} />
        {/* <Route path="/favorites" element={<PrivateRoute />}> */}
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />
        {/* </Route> */}
        {/* <Route path="/playlists" element={<PrivateRoute />}> */}
        <Route
          path="/playlists"
          element={
            <PrivateRoute>
              <Playlists />
            </PrivateRoute>
          }
        />
        {/* </Route> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

// extra small, xs: 0px
// small, sm: 600px
// medium, md: 900px
// large, lg: 1200px
// extra large, xl: 1536px
