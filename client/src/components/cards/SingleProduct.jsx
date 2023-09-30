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
import { useToasts } from "react-toast-notifications";

const { TabPane } = Tabs;

// this is childrend component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
    // redux
    const { user, cart } = useSelector((state) => ({ ...state }));
    const {addToast} = useToasts()
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
            addToast("Added To Cart", { appearance: "success", autoDismiss: true });
        }
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then((res) => {
            addToast("Added To Wishlist", { appearance: "success", autoDismiss: true });
        });
    };

    return (
        <>
            <div className={`shop-area pt-50 pb-50`}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3">
                            {images && images.length ? (
                                <Carousel
                                    showArrows={true}
                                    autoPlay
                                    infiniteLoop
                                >
                                    {images &&
                                        images.map((i) => (
                                            <img
                                                src={i.url}
                                                key={i.public_id}
                                            />
                                        ))}
                                </Carousel>
                            ) : (
                                <Card
                                    cover={
                                        <img
                                            src={Laptop}
                                            className="mb-3 card-image"
                                        />
                                    }
                                ></Card>
                            )}
                        </div>

                        <div className="col-lg-5 col-md-5">
                            <div className="product-details-content ml-50">
                                <h2>{product.title}</h2>
                                <div className="product-details-price">
                                    <span>{product.price} VND</span>
                                </div>

                                {product &&
                                product.ratings &&
                                product.ratings.length > 0 ? (
                                    showAverage(product)
                                ) : (
                                    <div className="text-center pt-1 pb-3">
                                        No rating yet
                                    </div>
                                )}

                                <div className="pro-details-list">
                                    <p dangerouslySetInnerHTML={{__html: product.description}}></p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4">
                            <div className="product-details-content">
                                <div className="pro-details-quality d-flex align-items-center justify-content-between">
                                    <div className="pro-details-cart btn-hover">
                                        <a
                                            onClick={handleAddToCart}
                                            disabled={product.quantity < 1}
                                        >
                                            {product.quantity < 1
                                                ? 'Out of Stock'
                                                : 'Add To Cart'}
                                        </a>
                                    </div>
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

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images &&
                            images.map((i) => (
                                <img src={i.url} key={i.public_id} />
                            ))}
                    </Carousel>
                ) : (
                    <Card
                        cover={<img src={Laptop} className="mb-3 card-image" />}
                    ></Card>
                )}

                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Call use on xxxx xxx xxx to learn more about this
                        product.
                    </TabPane>
                </Tabs>
            </div>

            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>

                {product && product.ratings && product.ratings.length > 0 ? (
                    showAverage(product)
                ) : (
                    <div className="text-center pt-1 pb-3">No rating yet</div>
                )}

                <Card
                    actions={[
                        <Tooltip placement="top" title={tooltip}>
                            <a
                                onClick={handleAddToCart}
                                disabled={product.quantity < 1}
                            >
                                <ShoppingCartOutlined className="text-danger" />
                                <br />
                                {product.quantity < 1
                                    ? 'Out of Stock'
                                    : 'Add To Cart'}
                            </a>
                        </Tooltip>,
                        <a onClick={handleAddToWishlist}>
                            <HeartOutlined className="text-info" /> <br /> Add
                            to Wishlist
                        </a>,
                        <RatingModal>
                            <StarRating
                                name={_id}
                                numberOfStars={5}
                                rating={star}
                                changeRating={onStarClick}
                                isSelectable={true}
                                starRatedColor="red"
                            />
                        </RatingModal>,
                    ]}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;
