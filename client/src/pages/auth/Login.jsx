import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrUpdateUser } from '../../functions/auth';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

const Login = () => {
    const auth = getAuth();
    const [email, setEmail] = useState('gqlreactnode@gmail.com');
    const [password, setPassword] = useState('gggggg');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
    // const roleBasedRedirect = (res) => {
    //   // check if intended
    //   let intended = history.location.state;
    //   if (intended) {
    //     history.push(intended.from);
    //   } else {
    //     if (res.data.role === "admin") {
    //       history.push("/admin/dashboard");
    //     } else {
    //       history.push("/user/history");
    //     }
    //   }
    // };

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
    //             name: res.data.name,
    //             email: res.data.email,
    //             token: idTokenResult.token,
    //             role: res.data.role,
    //             _id: res.data._id,
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
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                        // roleBasedRedirect(res);
                    })
                    .catch((err) => console.log(err));
                // history.push("/");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
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
        <div className="login-register-area pt-100 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                        <div className="login-register-wrapper">
                            <Tab.Container defaultActiveKey="login">
                                {loading ? (
                                    <h4 className="text-danger">Loading...</h4>
                                ) : (
                                    <Nav
                                        variant="pills"
                                        className="login-register-tab-list"
                                    >
                                        <Nav.Item>
                                            <Nav.Link eventKey="login">
                                                <h4>Login</h4>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="register">
                                                <h4>Register</h4>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                )}

                                <Tab.Content>
                                    <Tab.Pane eventKey="login">
                                        <div className="login-form-container">
                                            <button
                                                onClick={googleLogin}
                                                className='btn rounded-lg shadow px-3 py-2 d-flex align-items-center justify-content-between'
                                                style={{minWidth:'fit-content',margin:'0 auto',width:'236px'}}
                                            >
                                                <GoogleOutlined />
                                                Login with Google
                                            </button>
                                            <br />
                                            <p
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                OR
                                            </p>
                                            <br />
                                            <div className="login-register-form">
                                                <form>
                                                    <input
                                                        type="text"
                                                        name="user-name"
                                                        placeholder="Username"
                                                    />
                                                    <input
                                                        type="password"
                                                        name="user-password"
                                                        placeholder="Password"
                                                    />
                                                    <div className="button-box">
                                                        <div className="login-toggle-btn">
                                                            <input type="checkbox" />
                                                            <label className="ml-10">
                                                                Remember me
                                                            </label>
                                                            <Link to="/forgot/password">
                                                                Forgot Password?
                                                            </Link>
                                                        </div>
                                                        <button type="submit">
                                                            <span>Login</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="register">
                                        <div className="login-form-container">
                                            <div className="login-register-form">
                                                <form>
                                                    <input
                                                        type="text"
                                                        name="user-name"
                                                        placeholder="Username"
                                                    />
                                                    <input
                                                        type="password"
                                                        name="user-password"
                                                        placeholder="Password"
                                                    />
                                                    <input
                                                        name="user-email"
                                                        placeholder="Email"
                                                        type="email"
                                                    />
                                                    <div className="button-box">
                                                        <button type="submit">
                                                            <span>
                                                                Register
                                                            </span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
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

                    <Link
                        to="/forgot/password"
                        className="float-right text-danger"
                    >
                        Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
