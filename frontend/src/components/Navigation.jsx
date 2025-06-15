import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/household">Hộ gia đình</Link></li>
        <li><Link to="/resident">Cư dân</Link></li>
        <li><Link to="/vehicle">Phương tiện</Link></li>
        <li><Link to="/account">Tài khoản</Link></li>
        <li><Link to="/collection-period">Kỳ thu</Link></li>
        <li><Link to="/fee">Phí</Link></li>
        <li><Link to="/feedback">Phản hồi</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation; 