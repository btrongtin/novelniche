import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { numberWithCommas } from '../../utils';

const Orders = ({ orders, handleStatusChange }) => {
  const mapBadgeColor = (status) => {
    if (status === 'Payment success')
      return <span className="badge badge-success">{status}</span>;
    return <span className="badge badge-info">{status}</span>;
  };
  const showOrderInTable = (order) => (
    <tr key={order._id}>
      <td>
        <Link to={`/admin/orders/${order._id}`}>
          <b>{order._id.toString().substr(order._id.toString().length - 8)}</b>
        </Link>
      </td>
      <td>{moment(order.createdAt).format('DD MMM YYYY - h:mm:ss a')}</td>
      <td>{order.orderedBy.name}</td>
      <td
        dangerouslySetInnerHTML={{
          __html: order.address || order.orderedBy.address,
        }}
      ></td>
      <td>{numberWithCommas(order.paymentIntent.amount || 0)}</td>
      <td>{mapBadgeColor(order.paymentIntent.status)}</td>
      <td>
        <select
          onChange={(e) => handleStatusChange(order._id, e.target.value)}
          className="form-control text-sm badge badge-primary"
          defaultValue={order.orderStatus}
          name="status"
        >
          <option value="Not Processed">Not Processed</option>
          <option value="Cash On Delivery">Cash On Delivery</option>
          <option value="Processing">Processing</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </td>
    </tr>
  );

  return (
    <>
      {orders && (
        <>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Địa chỉ</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái thanh toán</th>
                <th scope="col">Trạng thái giao hàng</th>
              </tr>
            </thead>
            <tbody>{orders.map((order) => showOrderInTable(order))}</tbody>
          </table>
        </>
      )}
    </>
  );
};

export default Orders;
