import axios from 'axios';

export const userCart = async (cart, authtoken) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/user/cart`,
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUserCart = async (authtoken) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });

export const emptyUserCart = async (authtoken) =>
  await axios.delete(`${import.meta.env.VITE_REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });

export const saveUserAddress = async (authtoken, address) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/user/address`,
    { address },
    {
      headers: {
        authtoken,
      },
    }
  );

export const applyCoupon = async (authtoken, coupon) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/user/cart/coupon`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  );

export const createOrder = async (paymentData, shippingAddress, authtoken) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/user/order`,
    { paymentData, shippingAddress },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUserOrders = async (authtoken) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/user/orders`, {
    headers: {
      authtoken,
    },
  });

export const getWishlist = async (authtoken) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/user/wishlist`, {
    headers: {
      authtoken,
    },
  });

export const removeWishlist = async (productId, authtoken) =>
  await axios.put(
    `${import.meta.env.VITE_REACT_APP_API}/user/wishlist/${productId}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );

export const addToWishlist = async (productId, authtoken) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: {
        authtoken,
      },
    }
  );

export const createCashOrderForUser = async (
  authtoken,
  COD,
  couponTrueOrFalse,
  shippingAddress
) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/user/cash-order`,
    { couponApplied: couponTrueOrFalse, COD, shippingAddress },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUsersCount = async (authtoken) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/admin/users/total`, {
    headers: {
      authtoken,
    },
  });

export const getUsers = async (authtoken, sort, order, page, perPage) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/admin/users`,
    { sort, order, page, perPage },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getEmployees = async (authtoken, sort, order, page, perPage) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/admin/employees`,
    { sort, order, page, perPage },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUserDetail = async (userId, authtoken) =>
  await axios.get(
    `${import.meta.env.VITE_REACT_APP_API}/admin/users/${userId}`,
    {
      headers: {
        authtoken,
      },
    }
  );
