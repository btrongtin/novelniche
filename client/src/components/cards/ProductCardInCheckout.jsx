import React from 'react';
import ModalImage from 'react-modal-image';
import laptop from '../../images/laptop.png';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { numberWithCommas } from '../../utils';
import { Link } from 'react-router-dom';

const ProductCardInCheckout = ({ p }) => {
  let dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    // console.log("available quantity", p.quantity);
    let count = e.target.value < 1 ? 1 : e.target.value;

    if (count > p.quantity) {
      toast.error(`Max available quantity: ${p.quantity}`);
      return;
    }

    let cart = [];

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      cart.map((product, i) => {
        if (product._id == p._id) {
          cart[i].count = count;
        }
      });

      localStorage.setItem('cart', JSON.stringify(cart));
      dispatch({
        type: 'ADD_TO_CART',
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    // console.log(p._id, "to remove");
    let cart = [];

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      // [1,2,3,4,5]
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart.splice(i, 1);
        }
      });

      localStorage.setItem('cart', JSON.stringify(cart));
      dispatch({
        type: 'ADD_TO_CART',
        payload: cart,
      });
    }
  };

  return (
    <tr>
      <td>
        <div style={{ width: '100px', height: 'auto' }}>
          {p.images.length ? (
            <ModalImage small={p.images[0].url} large={p.images[0].url} />
          ) : (
            <ModalImage small={laptop} large={laptop} />
          )}
        </div>
      </td>
      <td>
        <Link to={`/product/${p.slug}`}>{p.title}</Link>
      </td>
      <td>{p.price} VND</td>
      <td className="text-center">
        <input
          type="number"
          className="form-control"
          value={p.count}
          onChange={handleQuantityChange}
        />
      </td>
      <td className="text-center">
        {numberWithCommas(p.price * p.count || 0)} đ
      </td>
      <td className="text-center">
        <CloseOutlined onClick={handleRemove} className="text-danger pointer" />
      </td>
    </tr>
  );
};

export default ProductCardInCheckout;
