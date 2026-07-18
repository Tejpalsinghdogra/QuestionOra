import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const navigate = useNavigate();
  // useLocation causes a re-render on every navigation, ensuring we re-read localStorage
  useLocation();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  let userRole = null;
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      userRole = JSON.parse(userStr).role;
    } catch (e) {}
  }

  const showSidebar = () => setIsSidebarActive(true);
  const hideSidebar = () => setIsSidebarActive(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    hideSidebar();
    navigate('/');
  };

  return (
    <nav>
      <div className="containern2">
        <div className="navc1">
          <ul className="uln">
            <li>
              <img 
                onClick={showSidebar} 
                id="min" 
                src="/images/menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" 
                alt="Menu icon" 
              />
            </li>
            <li className="hmnb"><Link to="/">Home</Link></li>
            {userRole === 'teacher' || userRole === 'admin' ? (
              <li className="hmnb"><Link to="/teacher">Upload Paper</Link></li>
            ) : null}
            {userRole === 'admin' && (
              <li className="hmnb"><Link to="/admin">Admin Panel</Link></li>
            )}
            <li className="hmnb"><Link to="/faq">Faq/Help</Link></li>
          </ul>
          <div className="rin">
            {isLoggedIn ? (
              <button id="bnn" onClick={handleLogout}>LogOut</button>
            ) : (
              <Link className="rinb" to="/signup"><button id="bnn">SignUp</button></Link>
            )}
            <img id="uin" src="/images/user_icon-removebg-preview.png" alt="User icon" />
          </div>
        </div>
      </div>
      <div className={`sidebarn ${isSidebarActive ? 'active' : ''}`}>
        <ul>
          <li className="no-hover">
            <img 
              onClick={hideSidebar} 
              id="uin" 
              src="/images/close_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" 
              alt="Close icon" 
            />
          </li>
          <li><Link to="/" onClick={hideSidebar}>Home</Link></li>
          {userRole === 'teacher' || userRole === 'admin' ? (
            <li><Link to="/teacher" onClick={hideSidebar}>Upload Paper</Link></li>
          ) : null}
          {userRole === 'admin' && (
            <li><Link to="/admin" onClick={hideSidebar}>Admin Panel</Link></li>
          )}
          <li><Link to="/faq" onClick={hideSidebar}>Faq/Help</Link></li>
          {isLoggedIn ? (
            <li><Link to="#" onClick={handleLogout}>Log Out</Link></li>
          ) : (
            <li><Link to="/signup" onClick={hideSidebar}>Sign Up</Link></li>
          )}
        </ul>
      </div>  
    </nav>
  );
}

export default Navbar;
