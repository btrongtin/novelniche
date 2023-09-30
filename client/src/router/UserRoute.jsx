import { Outlet } from 'react-router-dom';
import Header from '../components/nav/Header';
import { ToastContainer } from 'react-toastify';
import LoadingToRedirect from './LoadingToRedirect';
import { useSelector } from 'react-redux';
import Footer from '../components/nav/footer/Footer';

const UserRoute = () => {
  const { user } = useSelector((state) => ({ ...state }));

  // return user && user.token ? <Route {...rest} /> : <LoadingToRedirect />;
  return user && user.token ? (
    <>
      <Header />
      <div className="container mt-100 mb-5">
        <div className="row" style={{ width: '100%' }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <LoadingToRedirect />
  );
};

export default UserRoute;
