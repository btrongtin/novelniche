import axios from "axios";

export const getAuthors = async () =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/authors`);

export const getAuthor = async (slug) =>
  await axios.get(`${import.meta.env.VITE_REACT_APP_API}/author/${slug}`);

export const removeAuthor = async (slug, authtoken) =>
  await axios.delete(`${import.meta.env.VITE_REACT_APP_API}/author/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateAuthor = async (slug, author, authtoken) =>
  await axios.put(`${import.meta.env.VITE_REACT_APP_API}/author/${slug}`, author, {
    headers: {
      authtoken,
    },
  });

export const createAuthor = async (author, authtoken) =>
  await axios.post(`${import.meta.env.VITE_REACT_APP_API}/author`, author, {
    headers: {
      authtoken,
    },
  });