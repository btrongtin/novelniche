import {
    createBrowserRouter,
    Outlet,
} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import AdminRoute from './AdminRoute';
import UserRoute from './UserRoute';
import PublicRoute from './PublicRoute';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import CategoryCreate from '../pages/admin/category/CategoryCreate';
import CategoryUpdate from '../pages/admin/category/CategoryUpdate';
import AuthorCreate from '../pages/admin/author/AuthorCreate';
import AuthorUpdate from '../pages/admin/author/AuthorUpdate';
import History from '../pages/user/History';
import Password from '../pages/user/Password';
import Wishlist from '../pages/user/Wishlist';
import Checkout from '../pages/Checkout';
import ProductCreate from '../pages/admin/product/ProductCreate';
import AllProducts from '../pages/admin/product/AllProducts';
import ProductUpdate from '../pages/admin/product/ProductUpdate';
import CreateCouponPage from '../pages/admin/coupon/CreateCouponPage';
import Register from '../pages/auth/Register';
import RegisterComplete from '../pages/auth/RegisterComplete';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Product from '../pages/Product';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import LoadingToRedirect from './LoadingToRedirect';
import OrderPage from '../pages/admin/order/OdersPage';
import OrderDetail from '../pages/admin/order/OrderDetail';
import About from '../pages/About';
import Payment from '../pages/Payment';
import Orderplaced from '../pages/Orderplaced';
import Users from '../pages/admin/user/Users';
// import Payment from '../pages/Payment';

// import Login from '../pages/auth/Login';
// import AuthProvider from '../context/AuthProvider';

const AuthLayout = () => {
    // console.log("here");
    // const location = useLocation();
    // console.log("LCOATION: ", location);
    // if (location === "/a") return <Navigate to="/login" />;
    // return <Outlet />;
    return (
        // <AuthProvider>
            <Outlet />
        // </AuthProvider>
    );
};

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <LoadingToRedirect />,
        children: [
            {
                element: <PublicRoute />,
                children: [
                    {
                        element: <Home />,
                        path: '/',
                    },
                    {
                        element: <Login />,
                        path: '/login',
                    },
                    {
                        element: <Register />,
                        path: '/register',
                    },
                    {
                        element: <RegisterComplete />,
                        path: '/register/complete',
                    },
                    {
                        element: <ForgotPassword />,
                        path: '/forgot/password',
                    },
                    {
                        element: <Product />,
                        path: '/product/:slug',
                    },
                    {
                        element: <Shop />,
                        path: '/shop',
                    },
                    {
                        element: <Cart />,
                        path: '/cart',
                    },
                    {
                        element: <About />,
                        path: '/about',
                    },
                ],
            },
            {
                element: <AdminRoute />,
                children: [
                    {
                        element: <AdminDashboard />,
                        path: '/admin/dashboard',
                    },
                    {
                        element: <OrderPage />,
                        path: '/admin/orders',
                    },
                    {
                        element: <OrderDetail />,
                        path: '/admin/orders/:slug',
                    },
                    {
                        element: <CategoryCreate />,
                        path: '/admin/category',
                    },
                    {
                        element: <CategoryUpdate />,
                        path: '/admin/category/:slug',
                    },
                    {
                        element: <AuthorCreate />,
                        path: '/admin/author',
                    },
                    {
                        element: <AuthorUpdate />,
                        path: '/admin/author/:slug',
                    },
                    {
                        element: <ProductCreate />,
                        path: '/admin/product',
                    },
                    {
                        element: <AllProducts />,
                        path: '/admin/products',
                    },
                    {
                        element: <ProductUpdate />,
                        path: '/admin/product/:slug',
                    },
                    {
                        element: <CreateCouponPage />,
                        path: '/admin/coupon',
                    },
                    {
                        element: <Users />,
                        path: '/admin/users',
                    },
                ],
            },
            {
                element: <UserRoute />,
                children: [
                    {
                        element: <History />,
                        path: '/user/history',
                    },
                    {
                        element: <Password />,
                        path: '/user/password',
                    },
                    {
                        element: <Wishlist />,
                        path: '/user/wishlist',
                    },
                    {
                        element: <Checkout />,
                        path: '/checkout',
                    },
                    {
                        element: <Payment />,
                        path: '/payment',
                    },
                    {
                        element: <Orderplaced />,
                        path: '/orderplaced',
                    },
                ],
            },
        ],
    },
]);

export default router