import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/create-or-update-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/current-admin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const createNewEmployee = async (authtoken, newEmployee) => {
  return await axios.post(
    `${import.meta.env.VITE_REACT_APP_API}/createNewUser`,
    { newEmployee },
    {
      headers: {
        authtoken,
      },
    }
  );
};
