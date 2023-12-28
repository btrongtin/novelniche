import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { emptyUserCart, createOrder } from '../functions/user';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPaymentOrder } from '../functions/vnpay';

const Orderplaced = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    placeOrder();
  }, []);

  const placeOrder = async () => {
    const data = {
      amount: +searchParams.get('vnp_Amount') / 100 + '',
      bankCode: searchParams.get('vnp_BankCode'),
      bankTranNo: searchParams.get('vnp_BankTranNo'),
      cardType: searchParams.get('vnp_CardType'),
      transactionNo: searchParams.get('vnp_TransactionNo'),
      responseCode: searchParams.get('vnp_ResponseCode'),
    };
    const shippingAddress = localStorage.getItem('shippingAddress');
    const phone = localStorage.getItem('phone');
    const recipientName = localStorage.getItem('recipientName');
    // here you get result after successful payment
    // create order and save in database for admin to process
    createOrder(data, shippingAddress, phone, recipientName, user.token).then(
      (res) => {
        if (res.data.ok) {
          setOrderId(res.data.orderId);
          // empty cart from local storage
          if (typeof window !== 'undefined') localStorage.removeItem('cart');
          // empty cart from redux
          dispatch({
            type: 'ADD_TO_CART',
            payload: [],
          });
          // reset coupon to false
          dispatch({
            type: 'COUPON_APPLIED',
            payload: false,
          });
          // empty cart from database
          emptyUserCart(user.token);
        }
      }
    );
    // empty user cart from redux store and local storage
    console.log(JSON.stringify(data, null, 4));
  };

  return (
    <div className="container" style={{ height: 'calc(100vh - 210px)' }}>
      <div className="text-center">
        <h1 className="mt-5 mb-4">CẢM ƠN BẠN.</h1>
        <p style={{ fontSize: '16px' }}>
          Đơn hàng của bạn đã được đặt thành công, mã đơn hàng của bạn là
          <b> {orderId}</b>. Bạn sẽ nhận được email thông báo về chi tiết đơn
          hàng.
        </p>
        <Link to="/" className="mt-4 btn btn-outline-success">
          Back to homepage
        </Link>
      </div>
    </div>
  );
};

export default Orderplaced;
