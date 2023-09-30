import axios from 'axios';

export const createPaymentOrder = (authtoken) => {
    return axios.post(`${import.meta.env.VITE_REACT_APP_API}/vnpay`, {}, {
        headers: {
            authtoken,
        },
    });
};
