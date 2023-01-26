import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="link">
        Home
      </Link>
      <Link to="/dashboard" className="link">
        Dashboard
      </Link>
    </nav>
  );
};

export default Navbar;
