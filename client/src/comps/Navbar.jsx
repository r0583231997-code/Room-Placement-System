import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">מערכת שיבוץ - סמינר</div>
      <ul className="nav-links">
        <li><Link to="/">דף הבית</Link></li>
        <li><Link to="/rooms">ניהול חדרים</Link></li>
        <li><Link to="/placement">שיבוץ בנות</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;