import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from '../functions/user';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { createPaymentOrder } from '../functions/vnpay';
import { numberWithCommas } from '../utils';

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState('');
  // discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  const navigate = useNavigate();

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log('user cart res', JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
      setAddress(res.data.user.address);
      if (res.data.user.address) setAddressSaved(true);
    });
  }, []);

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    // remove from redux
    dispatch({
      type: 'ADD_TO_CART',
      payload: [],
    });
    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon('');
      toast.success('Cart is emapty. Continue shopping.');
    });
  };

  const saveAddressToDb = () => {
    // console.log(address);
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success('Address saved');
      }
    });
  };

  const applyDiscountCoupon = () => {
    console.log('send coupon to backend', coupon);
    applyCoupon(user.token, coupon).then((res) => {
      console.log('RES ON COUPON APPLIED', res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true/false
        dispatch({
          type: 'COUPON_APPLIED',
          payload: true,
        });
      }
      // error
      if (res.data.err) {
        setDiscountError(res.data.err);
        // update redux coupon applied true/false
        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        });
      }
    });
  };

  const handleOnlinePayment = () => {
    localStorage.setItem('shippingAddress', address);
    createPaymentOrder(user.token).then((res) => {
      window.location.href = decodeURI(res.data.redirectUrl);
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button
        className="btn btn-primary background-primary mt-2"
        onClick={saveAddressToDb}
      >
        Lưu
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={' '}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError('');
        }}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button
        onClick={applyDiscountCoupon}
        className="btn btn-primary background-primary mt-2"
      >
        Áp dụng
      </button>
    </>
  );

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse, address).then(
      (res) => {
        console.log('USER CASH ORDER CREATED RES ', res);
        // empty cart form redux, local Storage, reset coupon, reset COD, redirect
        if (res.data.ok) {
          // empty local storage
          if (typeof window !== 'undefined') localStorage.removeItem('cart');
          // empty redux cart
          dispatch({
            type: 'ADD_TO_CART',
            payload: [],
          });
          // empty redux coupon
          dispatch({
            type: 'COUPON_APPLIED',
            payload: false,
          });
          // empty redux COD
          dispatch({
            type: 'COD',
            payload: false,
          });
          // mepty cart from backend
          emptyUserCart(user.token);
          // redirect
          setTimeout(() => {
            navigate('/user/history');
          }, 1000);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="row pt-3 mt-3">
        <div className="col-md-6">
          <h4>Thông tin giao hàng</h4>
          <br />
          {showAddress()}
          <hr />
          <h4>Mã giảm giá</h4>
          {showApplyCoupon()}
          <br />
          {discountError && <p className="bg-danger p-2">{discountError}</p>}
        </div>

        <div className="col-md-6">
          <h4>Thông tin đơn hàng</h4>
          <hr />
          <p>{products.length} sản phẩm </p>
          <hr />
          {showProductSummary()}
          <hr />
          <p>
            Tổng cộng: <b>{numberWithCommas(total)} VNĐ</b>
          </p>

          {totalAfterDiscount > 0 && (
            <p className="bg-success py-2 px-3 text-white rounded-lg">
              Áp dụng thành công: Thành tiền mới:{' '}
              <b>{numberWithCommas(totalAfterDiscount)} VNĐ</b>
            </p>
          )}

          <div className="row">
            <div className="col-md-6">
              <button
                disabled={!products.length}
                onClick={emptyCart}
                className="btn btn-secondary"
              >
                Xóa giỏ hàng
              </button>
            </div>
            <div className="col-md-6">
              {COD ? (
                <button
                  className="btn btn-primary background-primary"
                  disabled={!addressSaved || !products.length}
                  onClick={createCashOrder}
                >
                  Đặt hàng
                </button>
              ) : (
                <button
                  className="btn btn-primary background-primary"
                  disabled={!addressSaved || !products.length}
                  onClick={handleOnlinePayment}
                >
                  Đặt hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
