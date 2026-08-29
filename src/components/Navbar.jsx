import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={token ? (user.role === "ADMIN" ? "/admin" : "/student") : "/login"}>QCMApp</Link>
      </div>
      {token && (
        <ul className="navbar-links">
          {user.role === "STUDENT" && (
            <>
              <li><Link to="/student">EXAMENS</Link></li>
              <li><Link to="/student/results">RÉSULTATS</Link></li>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <li><Link to="/admin">DASHBOARD</Link></li>
              <li><Link to="/admin/students">ETUDIANTS</Link></li>
              <li><Link to="/admin/courses">COURS</Link></li>
              <li><Link to="/admin/exams">EXAMENS</Link></li>
            </>
          )}

          <li>
            <button onClick={handleLogout} className='logout-btn'>
              DÉCONNEXION
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;