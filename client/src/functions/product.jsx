import axios from 'axios';
import { filter } from 'lodash';

export const createProduct = async (product, authtoken) =>
  await axios.post(`${import.meta.env.VITE_REACT_APP_API}/product`, product, {
    headers: {
      authtoken,
    },
  });

export const removeProduct = async (slug, authtoken) =>
  await axios.delete(`${import.meta.env.VITE_REACT_APP_API}/product/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const getProduct = async (slug) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/product/${slug}`);

export const updateProduct = async (slug, product, authtoken) =>
  await axios.put(
    `${import.meta.env.VITE_REACT_APP_API}/product/${slug}`,
    product,
    {
      headers: {
        authtoken,
      },
    }
  );

export const getProducts = async (
  sort = 'title',
  order = 'asc',
  page,
  perPage
) =>
  await axios.post(`${import.meta.env.VITE_REACT_APP_API}/products`, {
    sort,
    order,
    page,
    perPage,
  });

export const getProductsCount = async () =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/products/total`);

export const productStar = async (productId, star, authtoken) =>
  await axios.put(
    `${import.meta.env.VITE_REACT_APP_API}/product/star/${productId}`,
    { star },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getRelated = async (productId) =>
  await axios.get(
    `${import.meta.env.VITE_REACT_APP_API}/product/related/${productId}`
  );

export const fetchProductsByFilter = async (arg) =>
  await axios.post(`${import.meta.env.VITE_REACT_APP_API}/search/filters`, arg);

export const fetchProductsByFilterAdmin = async (filter) =>
  await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/search/filters-admin`,
    filter
  );
