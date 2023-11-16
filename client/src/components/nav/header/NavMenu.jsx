import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  return (
    <div
      className={` ${
        sidebarMenu
          ? 'sidebar-menu'
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ''}`
      } `}
    >
      <nav>
        <ul>
          <li>
            <Link to={'/'}>Trang Chủ</Link>
          </li>
          <li>
            <Link to={'/shop'}>Cửa Hàng</Link>
          </li>
          <li>
            <Link to={'/aboutus'}>Giới Thiệu</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
  strings: PropTypes.object,
};

export default NavMenu;
