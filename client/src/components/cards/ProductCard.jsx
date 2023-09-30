import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import laptop from '../../images/laptop.png';
import { Link, useNavigate } from 'react-router-dom';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist } from '../../functions/user';
import { useToasts } from "react-toast-notifications";

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
            console.log('CART IN LOCAL: ', cart)
            console.log('PROD IN LOCAL: ', product)
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
        }
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        if(!user) {
            addToast("Please login to save wishlist", { appearance: "error", autoDismiss: true });
            return;
        }
        addToWishlist(product._id, user.token).then((res) => {
            addToast("Added To Wishlist", { appearance: "success", autoDismiss: true });
        });
    };

    // destructure
    const { images, title, description, slug, price } = product;
    return (
        <>
            {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)
            ) : (
                <div className="text-center pt-1 pb-3">No rating yet</div>
            )}

            <div
                className={`product-wrap ${
                    spaceBottomClass ? spaceBottomClass : ''
                }`}
            >
                <div className="product-img">
                    <Link to={`/product/${slug}`}>
                        <img
                            className="default-img"
                            src={
                                images && images.length ? images[0].url : laptop
                            }
                            alt=""
                        />
                        {images && images.length > 1 ? (
                            <img
                                className="hover-img"
                                src={images[1].url}
                                alt=""
                            />
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
                                    {product.quantity < 1
                                        ? 'Out of stock'
                                        : 'Add to Cart'}
                                </button>
                            }
                        </div>
                        <div className="pro-same-action pro-quickview">
                            <button
                                onClick={() => setModalShow(true)}
                                title="Quick View"
                            >
                                <i className="pe-7s-look" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="product-content text-center">
                    <h3>
                        <Link to={`/product/${slug}`}>{title}</Link>
                    </h3>
                    <div className="product-price">
                        <span>{price} VND</span>
                    </div>
                </div>
            </div>
        </>
    );
    return (
        <>
            {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)
            ) : (
                <div className="text-center pt-1 pb-3">No rating yet</div>
            )}

            <Card
                cover={
                    <img
                        src={images && images.length ? images[0].url : laptop}
                        style={{ height: '150px', objectFit: 'cover' }}
                        className="p-1"
                    />
                }
                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-warning" /> <br /> View
                        Product
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a
                            onClick={handleAddToCart}
                            disabled={product.quantity < 1}
                        >
                            <ShoppingCartOutlined className="text-danger" />{' '}
                            <br />
                            {product.quantity < 1
                                ? 'Out of stock'
                                : 'Add to Cart'}
                        </a>
                    </Tooltip>,
                ]}
            >
                <Meta
                    title={`${title} - $${price}`}
                    description={`${
                        description && description.substring(0, 40)
                    }...`}
                />
            </Card>
        </>
    );
};

export default ProductCard;
