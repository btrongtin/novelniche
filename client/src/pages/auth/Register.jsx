import React, { useState, useEffect } from 'react';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');

  const { user } = useSelector((state) => ({ ...state }));
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("ENV --->", process.env.REACT_APP_REGISTER_REDIRECT_URL);
    const config = {
      url: import.meta.env.VITE_REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, config);
    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );
    // save user email in local storage
    window.localStorage.setItem('emailForRegistration', email);
    // clear state
    setEmail('');
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email của bạn"
        autoFocus
      />

      <div className="button-box mb-3">
        <button type="submit" className="btn w-100">
          Đăng ký
        </button>
      </div>
      <p className="text-right">
        Đã có tài khoản?{' '}
        <Link to="/login">
          <b>Đăng nhập</b>
        </Link>
      </p>
    </form>
  );

  return (
    <div className="login-register-area pt-60 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-md-12 ml-auto mr-auto">
            <div className="login-register-wrapper">
              <h4 className="page-title text-center mb-5">Đăng ký</h4>
              <div className="login-form-container">
                <div className="login-register-form">{registerForm()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
