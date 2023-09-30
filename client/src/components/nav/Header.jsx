import { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Badge } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Search from '../forms/Search';
import Logo from './header/Logo';
import NavMenu from './header/NavMenu';
import IconGroup from './header/IconGroup';
import NovelNicheLogo from '../../assets/img/novelniche.svg';
import MobileMenu from './header/MobileMenu';

// import firebase from "firebase";

const Header = () => {
  return (
    <header
      className={`header-area clearfix container shadow-sm transparent-bar`}
    >
      <div className={` sticky-bar header-res-padding clearfix`}>
        <div className="container">
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              <Logo imageUrl={NovelNicheLogo} logoClass="logo" />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              <IconGroup />
            </div>
          </div>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
};

Header.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string,
};

export default Header;
