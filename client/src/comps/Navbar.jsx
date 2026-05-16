import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // וודאי שהנתיב נכון לקובץ שלך

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-text">מערכת שיבוץ חדרים</span>
        <img src={logo} alt="Logo" className="nav-logo-img" />
      </div>
      <ul className="nav-links">
        <li><Link to="/">דף הבית</Link></li>
        <li><Link to="/rooms">ניהול חדרים</Link></li>
        <li><Link to="/placement">שיבוץ בנות</Link></li>
        <li><Link to="/search">🔍 חיפוש</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;