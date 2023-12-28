import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const MobileNavMenu = () => {
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={'/login'}>Đăng nhập</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
