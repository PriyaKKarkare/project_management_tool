import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <div
        className="navbar-brand fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        Trello Lite
      </div>

      {user && (
        <div className="d-flex align-items-center gap-3">
          <div className="text-end text-white">
            <div className="fw-semibold">
              {user.name}
            </div>

            <small className="text-light text-capitalize">
              {user.role}
            </small>
          </div>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;