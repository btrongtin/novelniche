import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import laptop from '../../images/laptop.png';
import { Link, useNavigate } from 'react-router-dom';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist } from '../../functions/user';
import { useToasts } from 'react-toast-notifications';
import { numberWithCommas } from '../../utils';

const { Meta } = Card;

const ProductCard = ({ product, spaceBottomClass }) => {
  const { addToast } = useToasts();
  const [tooltip, setTooltip] = useState('Click to add');
  const [modalShow, setModalShow] = useState(false);

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== 'undefined') {
      // if cart is in local storage GET it
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      console.log('CART IN LOCAL: ', cart);
      console.log('PROD IN LOCAL: ', product);
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
      // show tooltip
      setTooltip('Added');

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
      addToast('Thêm vào giỏ hàng thành công', {
        appearance: 'success',
        autoDismiss: true,
      });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Hãy đăng nhập để thêm vào wishlist', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    addToWishlist(product._id, user.token).then((res) => {
      addToast('Thêm vào wishlist thành công', {
        appearance: 'success',
        autoDismiss: true,
      });
    });
  };

  // destructure
  const { images, title, description, slug, price } = product;
  return (
    <div className="mb-2">
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">Chưa có đánh giá</div>
      )}

      <div
        className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ''}`}
      >
        <div className="product-img">
          <Link to={`/product/${slug}`}>
            <img
              className="default-img"
              src={images && images.length ? images[0].url : laptop}
              alt=""
            />
            {images && images.length > 1 ? (
              <img className="hover-img" src={images[1].url} alt="" />
            ) : (
              ''
            )}
          </Link>

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                // className={wishlistItem !== undefined ? "active" : ""}
                // disabled={wishlistItem !== undefined}
                // title={
                //   wishlistItem !== undefined
                //     ? "Added to wishlist"
                //     : "Add to wishlist"
                // }
                // onClick={() => handleAddToWishlist(product, addToast)}
                onClick={handleAddToWishlist}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {
                <button
                  disabled={product.quantity < 1}
                  onClick={handleAddToCart}
                  className="active"
                >
                  {product.quantity < 1 ? 'Hết hàng' : 'Thêm'}
                </button>
              }
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          <h3 className="ellipsify">
            <Link to={`/product/${slug}`}>{title}</Link>
          </h3>
          <div className="product-price">
            <span className="primary-color">
              {numberWithCommas(price || 0)} VND
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
