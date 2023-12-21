import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { deleteFromCart } from '../../../redux/actions/cardActions';
import { getAuth, signOut } from 'firebase/auth';

const IconGroup = ({ iconWhiteClass }) => {
  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle('active');
  };
  const { user, cart } = useSelector((state) => ({ ...state }));

  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    // firebase.auth().signOut();
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.log('[REACTJS] ERROR WHEN SIGNOUT: ', error);
      });
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    navigate('/login');
  };

  function triggerMobileMenu() {
    const offcanvasMobileMenu = document.querySelector(
      '#offcanvas-mobile-menu'
    );
    offcanvasMobileMenu.classList.add('active');
  }

  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ''}`}
    >
      <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      {!user && (
        <div className="same-style account-setting d-none d-lg-block">
          <button
            className="account-setting-active"
            onClick={(e) => handleClick(e)}
          >
            <i className="pe-7s-user-female" />
          </button>
          <div className="account-dropdown">
            <ul>
              <li>
                <Link to={'/login'}>Đăng nhập</Link>
              </li>
              <li>
                <Link to={'/register'}>Đăng ký</Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {user && (
        <div className="same-style account-setting d-none d-lg-block">
          <button
            className="account-setting-active"
            style={{
              transform: 'translateY(-25%)',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            onClick={(e) => handleClick(e)}
          >
            Xin chào, {user.email.split('@')[0]}
          </button>
          <div className="account-dropdown">
            <ul>
              {user.role === 'guest' && (
                <>
                  <li>
                    <Link to={'/user/history'}>Đơn đặt hàng</Link>
                  </li>
                  <li>
                    <Link to={'/user/wishlist'}>Yêu thích</Link>
                  </li>
                </>
              )}
              {(user.role === 'admin' || user.role === 'clerk') && (
                <>
                  <li>
                    <Link to={'/admin/dashboard'}>Quản lý</Link>
                  </li>
                  <li>
                    <Link to={'/user/history'}>Đơn đặt hàng</Link>
                  </li>
                  <li>
                    <Link to={'/user/wishlist'}>Yêu thích</Link>
                  </li>
                </>
              )}
              <li>
                <Link onClick={handleLogout}>Đăng xuất</Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="same-style cart-wrap d-none d-lg-block">
        <Link className="icon-cart" to="/cart">
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cart && cart.length ? cart.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={'/cart'}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cart && cart.length ? cart.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    cartData: state.cartData,
    wishlistData: state.wishlistData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
