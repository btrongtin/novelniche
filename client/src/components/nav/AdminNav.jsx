import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Logo from './header/Logo';
import { BsFillHouseFill } from 'react-icons/bs';
import { BsFillBookFill } from 'react-icons/bs';
import { BsMenuButtonWide } from 'react-icons/bs';
import { BsPersonCircle } from 'react-icons/bs';
import { BsFillTicketPerforatedFill } from 'react-icons/bs';
import { BsArrowBarRight } from 'react-icons/bs';
import { BsArrowBarLeft } from 'react-icons/bs';
import { BsCardChecklist } from 'react-icons/bs';
import { BsFillPersonFill } from 'react-icons/bs';
import NovelNicheLogo from '../../assets/img/novelniche.svg';

const AdminNav = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <nav>
                <Sidebar collapsed={collapsed}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            position: 'relative',
                        }}
                    >
                        <div className="sidebar-header d-flex align-items-center justify-content-center">
                            <div
                                className="sidebar-header-image d-flex justify-content-center"
                                style={{ width: '100%' }}
                            >
                                {/* <Logo
                                    imageUrl="https://miro.medium.com/v2/resize:fit:1000/1*Yafu7ihc1LFuP4azerAa4w.png"
                                    logoClass="logo"
                                /> */}
                                <Link to="/">
                                    <img
                                        className="sidebar-header-logo"
                                        src={NovelNicheLogo}
                                        alt="logo"
                                        style={{ maxWidth: '100%' }}
                                    />
                                </Link>
                            </div>
                            {/* {!collapsed && (
                                <span
                                    className="text-gray font-weight-bold"
                                    style={{ fontSize: '16px' }}
                                >
                                    NovelNiche
                                </span>
                            )} */}
                        </div>
                        <div
                            className=""
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                zIndex: '999',
                                position: 'absolute',
                                top: '30px',
                                right: '-20px',
                                cursor: 'pointer',
                                fontSize: '24px',
                                padding: '6px',
                                borderRadius: '100%',
                                opacity: '0.4'
                            }}
                        >
                            {collapsed ? (
                                <BsArrowBarRight />
                            ) : (
                                <BsArrowBarLeft />
                            )}
                        </div>
                        <div className="mb-2">
                            <span
                                className="font-weight-bold px-3"
                                style={{
                                    opacity: !collapsed ? '0.5' : '0',
                                    fontSize: '12px',
                                }}
                            >
                                General
                            </span>
                        </div>
                        <Menu
                            menuItemStyles={{
                                button: {
                                    // the active class will be added automatically by react router
                                    // so we can use it to style the active menu item
                                    [`&.active`]: {
                                        backgroundColor: '#498374',
                                        color: '#fff',
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                component={<NavLink to="/admin/dashboard" />}
                                icon={<BsFillHouseFill />}
                            >
                                {' '}
                                Dashboard
                            </MenuItem>
                            <MenuItem
                                component={<NavLink to="/admin/orders" />}
                                icon={<BsCardChecklist />}
                            >
                                {' '}
                                Orders
                            </MenuItem>
                            <MenuItem
                                component={<NavLink to="/admin/users" />}
                                icon={<BsFillPersonFill />}
                            >
                                {' '}
                                Users
                            </MenuItem>
                            <MenuItem
                                component={<NavLink to="/admin/products" />}
                                icon={<BsFillBookFill />}
                            >
                                {' '}
                                Products
                            </MenuItem>
                            <MenuItem
                                component={<NavLink to="/admin/category" />}
                                icon={<BsMenuButtonWide />}
                            >
                                {' '}
                                Category
                            </MenuItem>
                            <MenuItem
                                component={<NavLink to="/admin/author" />}
                                icon={<BsPersonCircle />}
                            >
                                {' '}
                                Author
                            </MenuItem>
                            <MenuItem
                                component={<NavLink to="/admin/coupon" />}
                                icon={<BsFillTicketPerforatedFill />}
                            >
                                {' '}
                                Coupon
                            </MenuItem>
                            {/* <MenuItem
                                component={<NavLink to="/user/password" />}
                            >
                                {' '}
                                Change password
                            </MenuItem> */}
                        </Menu>
                    </div>
                </Sidebar>
            </nav>
        </>
    );
};

export default AdminNav;
