import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/nav/Header';
import Footer from '../components/nav/footer/Footer';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);
    let navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000);
        // redirect once count is equal to 0
        count === 0 && navigate('/');
        // cleanup
        return () => clearInterval(interval);
    }, [count, navigate]);

    return (
        <>
        <Header/>
        <div className="error-area pt-40 mt-5 pb-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7 col-lg-8 text-center">
                        <div className="error">
                            <h1>404</h1>
                            <h2>OPPS! PAGE NOT FOUND</h2>
                            <p>
                                Sorry but the page you are looking for does not
                                exist, have been removed, name changed or is
                                temporarity unavailable. You may need to log in to access the content.
                            </p>
                            <div className="d-flex align-items-center justify-content-around">
                            <Link
                                to={'/'}
                                className="error-btn"
                            >
                                Back to home page
                            </Link>
                            <Link
                                to={'/login'}
                                className="error-btn"
                            >
                                Login
                            </Link>
                            </div>
                            <p className='mt-3'>Redirecting you in {count} seconds</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default LoadingToRedirect;
