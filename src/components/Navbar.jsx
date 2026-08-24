import {Link,useNavigate} from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
  //const user = {role: "admin"};
  const user=JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear;
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">QCMApp</Link>
      </div>
        <ul className="navbar-links">
            {user.role === "student" && (
                <>
                    <li><Link to="/student/exams">EXAMENS</Link></li>
                    <li><Link to="/student/results">RÉSULTATS</Link></li>
                </>
            )}
            {user.role === "admin" && (
               <>
                    <li><Link to="/admin/dashboard">DASHBOARD</Link></li>
                    <li><Link to="/admin/students">ÉTUDIANTS</Link></li>
                    <li><Link to="/admin/exams">EXAMENS</Link></li>   
               </> 
            )}
        </ul>
        <button onClick={handleLogout} className='logout-btn'>
            DÉCONNEXION
        </button>
    </nav>
  );
};

export default Navbar;