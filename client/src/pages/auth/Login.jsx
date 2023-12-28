import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrUpdateUser } from '../../functions/auth';
import { useToasts } from 'react-toast-notifications';

const Login = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('gqlreactnode@gmail.com');
  const [password, setPassword] = useState('gggggg');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    // let intended = history.location.state;
    // if (intended) {
    //     return;
    // } else {
    //     if (user && user.token) history.push('/');
    // }
    // }, [user, history]);
    if (user && user.token) navigate('/');
  }, [user]);
  console.log('USER: ', user);
  let dispatch = useDispatch();

  //TO REDIRECT USER BACK TO WHERE THEY REQUEST
  const roleBasedRedirect = (res) => {
    if (res.data.user.role === 'admin' || res.data.user.role === 'clerk') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // console.table(email, password);
  //   try {
  //     const result = await auth.signInWithEmailAndPassword(email, password);
  //     // console.log(result);
  //     const { user } = result;
  //     const idTokenResult = await user.getIdTokenResult();

  //     createOrUpdateUser(idTokenResult.token)
  //       .then((res) => {
  //         dispatch({
  //           type: "LOGGED_IN_USER",
  //           payload: {
  //             name: res.data.user.name,
  //             email: res.data.user.email,
  //             token: idTokenResult.token,
  //             role: res.data.user.role,
  //             _id: res.data.user._id,
  //           },
  //         });
  //         roleBasedRedirect(res);
  //       })
  //       .catch((err) => console.log(err));

  //     // history.push("/");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.user.name,
                email: res.data.user.email,
                token: idTokenResult.token,
                role: res.data.user.role,
                _id: res.data.user._id,
                state: res.data.user.state,
              },
            });
            if (res.data.success) {
              roleBasedRedirect(res);
            } else {
              addToast(
                'Tài khoản của bạn đang bị vô hiệu hóa. Bạn sẽ không thể thực hiện một số hành động. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.',
                {
                  appearance: 'error',
                  autoDismiss: false,
                }
              );
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const loginForm = () => (
  //   <form onSubmit={handleSubmit}>
  //     <div className="form-group">
  //       <input
  //         type="email"
  //         className="form-control"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         placeholder="Your email"
  //         autoFocus
  //       />
  //     </div>

  //     <div className="form-group">
  //       <input
  //         type="password"
  //         className="form-control"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         placeholder="Your password"
  //       />
  //     </div>

  //     <br />
  //     <Button
  //       onClick={handleSubmit}
  //       type="primary"
  //       className="mb-3"
  //       block
  //       shape="round"
  //       icon={<MailOutlined />}
  //       size="large"
  //       disabled={!email || password.length < 6}
  //     >
  //       Login with Email/Password
  //     </Button>
  //   </form>
  // );

  return (
    <div className="login-register-area pt-60 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-md-12 ml-auto mr-auto">
            <div className="login-register-wrapper">
              <div className="">
                <h4 className="page-title text-center mb-5">Đăng nhập</h4>
                <div className="login-form-container">
                  <button
                    onClick={googleLogin}
                    className="btn rounded-lg shadow px-3 py-2 d-flex align-items-center justify-content-between"
                    style={{
                      minWidth: 'fit-content',
                      margin: '0 auto',
                      width: '236px',
                    }}
                  >
                    <GoogleOutlined />
                    <span className="ml-3">
                      Đăng nhập bằng tài khoản Google
                    </span>
                  </button>
                  <br />
                  <p
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {/* Hoặc */}
                  </p>
                  {/* <br />
                    <div className="login-register-form">
                      <form>
                        <input type="text" name="user-name" placeholder="email" />
                        <input
                          type="password"
                          name="user-password"
                          placeholder="mật khẩu"
                        />
                        <div className="button-box mb-3">
                          <div className="login-toggle-btn">
                            <input type="checkbox" />
                            <label className="ml-10">Ghi nhớ</label>
                            <Link to="/forgot/password">Quên mật khẩu?</Link>
                          </div>
                          <button type="submit" className="w-100">
                            <span>Đăng nhập</span>
                          </button>
                        </div>
                        <p className="text-right">
                          Chưa có tài khoản?{' '}
                          <Link to="/register">Đăng ký ngay</Link>
                        </p>
                      </form>
                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {/* {loginForm()} */}

          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>

          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
