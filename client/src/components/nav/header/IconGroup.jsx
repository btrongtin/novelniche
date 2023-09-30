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
            className={`header-right-wrap ${
                iconWhiteClass ? iconWhiteClass : ''
            }`}
        >
            <div className="same-style header-search d-none d-lg-block">
                <button
                    className="search-active"
                    onClick={(e) => handleClick(e)}
                >
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
                                <Link to={'/login'}>Login</Link>
                            </li>
                            <li>
                                <Link to={'/register'}>Register</Link>
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
                        Hello, {user.email.split('@')[0]}
                    </button>
                    <div className="account-dropdown">
                        <ul>
                            {user.role === 'subscriber' && (
                                <>
                                    <li>
                                        <Link to={'/user/history'}>
                                            My orders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/user/wishlist'}>
                                            Wishlist
                                        </Link>
                                    </li>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <li>
                                        <Link to={'/admin/dashboard'}>
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/user/wishlist'}>
                                            Wishlist
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/user/history'}>
                                            My orders
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link onClick={handleLogout}>Logout</Link>
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
