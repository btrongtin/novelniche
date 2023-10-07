import React, { useState, useEffect } from 'react';
import { getWishlist, removeWishlist } from '../../functions/user';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();

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
                    <h4 className="font-weight-bold mb-5">
                        Your wishlist items
                    </h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlist.map((p) => (
                                <tr key={p._id}>
                                    <td>
                                        <Link
                                            to={`/product/${p.slug}`}
                                            key={p._id}
                                        >
                                            <div
                                                className=""
                                                style={{ width: '120px' }}
                                            >
                                                <img
                                                    src={p.images[0].url}
                                                    style={{
                                                        maxWidth: '100%',
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="align-middle">
                                        <Link
                                            to={`/product/${p.slug}`}
                                            key={p._id}
                                        >
                                            {p.title}
                                        </Link>
                                    </td>
                                    <td className="align-middle">
                                        {p.price} VND
                                    </td>
                                    <td className="align-middle">
                                        <div className="d-flex justify-content-end">
                                            <div
                                                className="btn btn-success btn-sm"
                                                onClick={() =>
                                                    handleAddToCart(p)
                                                }
                                            >
                                                Add to cart
                                            </div>
                                            <div
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleRemove(p._id)
                                                }
                                            >
                                                Remove
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Wishlist;