import React, { useState, useEffect } from 'react';
import { getWishlist, removeWishlist } from '../../functions/user';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { numberWithCommas } from '../../utils';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();
  console.log('WL: ', wishlist);
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () =>
    getWishlist(user.token).then((res) => {
      setWishlist(res.data.wishlist);
    });

  const handleRemove = (productId) =>
    removeWishlist(productId, user.token).then((res) => {
      loadWishlist();
    });

  const handleAddToCart = (product) => {
    // create cart array
    let cart = [];
    if (typeof window !== 'undefined') {
      // if cart is in local storage GET it
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem('cart', JSON.stringify(unique));

      // add to reeux state
      dispatch({
        type: 'ADD_TO_CART',
        payload: unique,
      });
      // show cart items in side drawer
      dispatch({
        type: 'SET_VISIBLE',
        payload: true,
      });
      handleRemove(product._id);
    }
  };
  return (
    <div className="mt-3 mb-5" style={{ width: '100%' }}>
      {!wishlist.length ? (
        <div className="row" style={{ marginTop: '3rem' }}>
          <div className="col-lg-12">
            <div className="item-empty-area text-center">
              <div className="item-empty-area__icon mb-30">
                <i className="pe-7s-like"></i>
              </div>
              <div className="item-empty-area__text">
                No items found in wishlist <br />{' '}
                <Link to={'/shop'}>Add Items</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h4 className="text-bold mb-5 mt-4">Danh sách yêu thích</h4>
          <div className="row">
            {wishlist.map((p) => (
              <div className="col-md-12 col-lg-12 row mb-3" key={p._id}>
                <div className="col-md-2 col-lg-2">
                  <img
                    src={p.images[0].url}
                    alt=""
                    className="product-wishlist-img"
                  />
                </div>
                <div className="col-md-8 col-lg-8" style={{ fontSize: '16px' }}>
                  <Link to={`/product/${p.slug}`}>{p.title}</Link>
                  <p className="prod-price-sm text-sm mt-2">
                    {numberWithCommas(p.price || 0)} VND
                  </p>
                </div>
                <div className="col-md-2 col-lg-2">
                  <div className="d-flex flex-column">
                    <div
                      className="btn-add-to-cart rounded"
                      onClick={() => handleAddToCart(p)}
                    >
                      THÊM VÀO GIỎ HÀNG
                    </div>
                    <div
                      className="btn-remove-from-cart d-flex align-items-center justify-content-end"
                      onClick={() => handleRemove(p._id)}
                    >
                      <BsFillTrash3Fill style={{ fontSize: '16px' }} />
                      <span className="ml-2">XÓA SẢN PHẨM</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
