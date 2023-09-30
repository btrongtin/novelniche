import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './router';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { currentUser } from './functions/auth';
import { ToastProvider } from "react-toast-notifications";

function App() {
    const dispatch = useDispatch();
    const auth = getAuth();

    // to check firebase auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                console.log('user', user);

                currentUser(idTokenResult.token)
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
                    })
                    .catch((err) => console.log(err));
            }
        });
        // cleanup
        return () => unsubscribe();
    }, [auth, dispatch]);

    return (
        <>
            <ToastProvider placement="bottom-right">
                <RouterProvider router={router} />
            </ToastProvider>
        </>
    );
}

export default App;
