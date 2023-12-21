import React, { useEffect, useState } from 'react';
import { Card, Tabs, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Laptop from '../../images/laptop.png';
import ProductListItems from './ProductListItems';
import StarRating from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist } from '../../functions/user';
import { useNavigate } from 'react-router-dom';
import { getProductCartQuantity } from '../../helpers/product';
import { useToasts } from 'react-toast-notifications';
import SectionTitle from '../section-title/SectionTitle';

const { TabPane } = Tabs;

// this is childrend component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  // router
  let navigate = useNavigate();

  const { title, images, description, _id } = product;
  const handleAddToCart = () => {
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
      localStorage.setItem('cart', JSON.stringify(unique));
      // show tooltip

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
      addToast('Thêm giỏ hàng thành công', {
        appearance: 'success',
        autoDismiss: true,
      });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      addToast('Thêm wishlist thành công', {
        appearance: 'success',
        autoDismiss: true,
      });
    });
  };

  return (
    <>
      <div className={`shop-area pt-50 pb-50`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3">
              {images && images.length ? (
                <Carousel showArrows={true} autoPlay infiniteLoop>
                  {images &&
                    images.map((i) => <img src={i.url} key={i.public_id} />)}
                </Carousel>
              ) : (
                <Card
                  cover={<img src={Laptop} className="mb-3 card-image" />}
                ></Card>
              )}
            </div>

            <div className="col-lg-5 col-md-5">
              <div className="product-details-content ml-50">
                <h2 className="mb-3">{product.title}</h2>
                <div className="d-flex align-items-center mb-3">
                  <span>
                    <b>Author:</b> {product.author?.name}
                  </span>
                  <span className="ml-5">
                    <b>Category:</b> {product.category?.name}
                  </span>
                </div>
                {product && product.ratings && product.ratings.length > 0 ? (
                  showAverage(product, 'text-align-left')
                ) : (
                  <div className="pt-1 pb-3">Chưa có đánh giá</div>
                )}
                <div className="product-details-price">
                  <SectionTitle
                    titleText={product.price + ' VND'}
                    colorClass={'section-title-yellow'}
                    textClass={'font-weight-bold text-lg'}
                  />
                </div>

                <div className="pro-details-list">
                  {/* <p
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></p> */}

                  <ul>
                    <li>
                      <span>
                        Publisher: Mariner Books Classics (1 Dec. 2002)
                      </span>
                    </li>
                    <li>
                      <span>Language: English</span>
                    </li>
                    <li>
                      <span>Paperback: 416 pages</span>
                    </li>
                    <li>
                      <span>Dimensions: 12.9 x 1.4 x 19.8 cm</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4">
              <div className="product-details-content">
                <div className="product-details-stamp">
                  New / Paperback - {product.price}
                </div>
                <div className="pro-details-quality">
                  <div className="pro-details-cart btn-hover">
                    <button
                      style={{ width: '100%' }}
                      onClick={handleAddToCart}
                      disabled={product.quantity < 1}
                    >
                      {product.quantity < 1 ? 'Hết hàng' : 'Thêm'}
                    </button>
                  </div>
                </div>
                <div className="pro-details-quality d-flex align-items-center justify-content-around">
                  <div className="pro-details-wishlist">
                    <button
                      // className={
                      //     wishlistItem !== undefined ? 'active' : ''
                      // }
                      // disabled={wishlistItem !== undefined}
                      // title={
                      //     wishlistItem !== undefined
                      //         ? 'Added to wishlist'
                      //         : 'Add to wishlist'
                      // }
                      onClick={handleAddToWishlist}
                    >
                      <i className="pe-7s-like" />
                    </button>
                  </div>
                  <RatingModal>
                    <StarRating
                      name={_id}
                      numberOfStars={5}
                      rating={star}
                      changeRating={onStarClick}
                      isSelectable={true}
                      starRatedColor="red"
                    />
                  </RatingModal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
