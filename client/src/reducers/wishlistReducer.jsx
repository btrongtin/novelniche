// import { useSelector } from "react-redux";

let initialState = [];

// get wishlist items from server
// const { user } = useSelector((state) => ({ ...state }));
// user.wishlist.length > 0 ? initialState = user.wishlist : initialState = [];

export const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return action.payload;
    default:
      return state;
  }
};
