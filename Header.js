import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from './assets/donation-logo.png';
import userlogo from './assets/user.jpg';

const Header = ({ loggedIn, handleLogout }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });

      return () => unsubscribe();
    }
  }, [loggedIn]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Donation Platform Logo" className="logo-image" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/community">Community</Link></li>
      </ul>

      <div className="navbar-actions">
        <div className="donate-button"><Link to="/add-donation">Donate</Link></div>
        {!user ? (
          <div className="login-button"><Link to="/login">Login</Link></div>
        ) : (
          <div className="user-button" onClick={() => navigate('/profile')}>
            <img src={userlogo} alt="User Icon" className="user-icon" />
            <span className="user-email-tooltip">{user?.email}</span>
            
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
