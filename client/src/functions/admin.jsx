import axios from 'axios';

export const getOrders = async (authtoken, sort, order, page, perPage) =>
    await axios.post(
        `${import.meta.env.VITE_REACT_APP_API}/admin/orders`,
        { sort, order, page, perPage },
        {
            headers: {
                authtoken,
            },
        }
    );

export const getOrdersCount = async (authtoken) =>
    await axios.get(`${import.meta.env.VITE_REACT_APP_API}/admin/orders/total`, {
        headers: {
            authtoken,
        },
    });

export const getOrderById = async (authtoken, orderId) =>
    await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/admin/order/${orderId}`,
        {
            headers: {
                authtoken,
            },
        }
    );

export const getOrdersBetweenDates = async (authtoken, startDate, endDate) =>
    await axios.post(
        `${import.meta.env.VITE_REACT_APP_API}/admin/orders`,
        { startDate, endDate },
        {
            headers: {
                authtoken,
            },
        }
    );

export const changeStatus = async (orderId, orderStatus, authtoken) =>
    await axios.put(
        `${import.meta.env.VITE_REACT_APP_API}/admin/order-status`,
        { orderId, orderStatus },
        {
            headers: {
                authtoken,
            },
        }
    );

    
export const getDashboard = async (authtoken) =>
await axios.get(
    `${import.meta.env.VITE_REACT_APP_API}/admin/dashboard`,
    {
        headers: {
            authtoken,
        },
    }
);