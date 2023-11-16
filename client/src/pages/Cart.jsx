import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import { userCart } from '../functions/user';
import { numberWithCommas } from '../utils';

const Cart = () => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    console.log('cart', JSON.stringify(cart, null, 4));
    userCart(cart, user.token)
      .then((res) => {
        console.log('CART POST RES', res);
        if (res.data.ok) navigate('/checkout');
      })
      .catch((err) => console.log('cart save err', err));
  };

  const saveCashOrderToDb = () => {
    // console.log("cart", JSON.stringify(cart, null, 4));
    dispatch({
      type: 'COD',
      payload: true,
    });
    userCart(cart, user.token)
      .then((res) => {
        console.log('CART POST RES', res);
        if (res.data.ok) navigate('/checkout');
      })
      .catch((err) => console.log('cart save err', err));
  };

  const showCartItems = () => (
    <table className="table">
      <thead>
        <tr>
          <th scope="col" colSpan={2} style={{ width: '40%' }}>
            Sản phẩm
          </th>
          <th scope="col" style={{ width: '20%' }}>
            Đơn giá
          </th>
          <th scope="col" style={{ width: '10%' }}>
            Số lượng
          </th>
          <th scope="col" style={{ width: '20%' }} className="text-center">
            Thành tiền
          </th>
          <th scope="col" style={{ width: '10%' }}></th>
        </tr>
      </thead>
      <tbody>
        {cart.map((p) => (
          <ProductCardInCheckout key={p._id} p={p} />
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container pt-5 pb-5">
      <div className="row">
        <div className="col-md-12 col-lg-12">
          <h4 className="pb-3">Giỏ Hàng / {cart.length} sản phẩm</h4>

          {!cart.length ? (
            <p>
              Chưa có sản phẩm trong giỏ hàng.{' '}
              <Link to="/shop">Tiếp tục mua hàng.</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        {/* <div className="col-md-4">
          <h4>Thông tin đơn hàng</h4>
          <hr />
          <p>Sản phẩm</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = {numberWithCommas(c.price * c.count)}{' '}
                VND
              </p>
            </div>
          ))}
          <hr />
          Tổng: <b>{numberWithCommas(getTotal())} VND</b>
          <hr />
          {user ? (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <button
                  onClick={saveOrderToDb}
                  className="btn btn-sm py-2 btn-primary mt-2"
                  disabled={!cart.length}
                >
                  Thanh toán online
                </button>
                <br />
                <button
                  onClick={saveCashOrderToDb}
                  className="btn btn-sm py-2 btn-warning mt-2"
                  disabled={!cart.length}
                >
                  Thanh toán khi nhận hàng
                </button>
              </div>
            </>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link
                to={{
                  pathname: '/login',
                  state: { from: 'cart' },
                }}
              >
                Đăng nhập để đặt hàng
              </Link>
            </button>
          )}
        </div> */}
      </div>
      <div className="row d-flex flex-column">
        <div className="ml-auto flex-middle">
          <span className="ml-auto text-bold">Tổng cộng</span>
          <span className="prod-price-sm ml-3">
            {numberWithCommas(getTotal())} VND
          </span>
        </div>
        <div className="ml-auto">
          {user ? (
            <>
              <div className="d-flex mt-3 align-items-center justify-content-between">
                <button
                  onClick={saveOrderToDb}
                  className="btn py-2 btn-primary background-primary text-white mt-2"
                  disabled={!cart.length}
                >
                  Thanh toán online
                </button>
                <button
                  onClick={saveCashOrderToDb}
                  className="btn py-2 btn-warning ml-3 mt-2"
                  disabled={!cart.length}
                >
                  Thanh toán khi nhận hàng
                </button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary bg-primary mt-2">
              <Link
                to={{
                  pathname: '/login',
                  state: { from: 'cart' },
                }}
              >
                Đăng nhập để đặt hàng
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
