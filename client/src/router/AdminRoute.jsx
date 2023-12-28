import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingToRedirect from './LoadingToRedirect';
import { currentAdmin } from '../functions/auth';
import Header from '../components/nav/Header';
import { ToastContainer } from 'react-toastify';
import AdminNav from '../components/nav/AdminNav';

export default function AdminRoute() {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.state === 'disabled') {
      setOk(false);
      return;
    }
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setOk(true);
        })
        .catch((err) => {
          setOk(false);
        });
    }
  }, [user]);
  return ok ? (
    <>
      {/* <Header /> */}
      {/* <ToastContainer /> */}
      <div className="container-fluid">
        <div className="d-flex">
          <div style={{ marginLeft: '-15px' }}>
            <AdminNav />
          </div>
          <div className="ml-5 mr-5 mt-5" style={{ width: '100%' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <LoadingToRedirect />
  );
}
