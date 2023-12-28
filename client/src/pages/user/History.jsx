import { useState, useEffect } from 'react';
import { getUserOrders } from '../../functions/user';
import { useSelector } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Invoice from '../../components/order/Invoice';
import { numberWithCommas } from '../../utils';
import moment from 'moment';

const History = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () =>
    getUserOrders(user.token).then((res) => {
      console.log(res.data);
      setOrders(res.data);
    });

  const showOrderInTable = (order) => (
    <>
      <div className="order-header mb-3">
        <div className="">
          <span>
            Mã đơn hàng: <b>{order._id}</b>
          </span>
          <br />
          <span className="order-time">
            Ngày đặt:{' '}
            {order.createdAt
              ? moment(order.createdAt).format('DD/MM/YYYY - h:mm:ss a')
              : ''}
          </span>
        </div>

        <span className="order-status badge badge-success p-2">
          {order.orderStatus}
        </span>
      </div>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Tên sách</th>
            <th scope="col">Đơn giá</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Thành tiền</th>
          </tr>
        </thead>

        <tbody>
          {order.products.map((p, i) => (
            <tr key={i}>
              <td>
                <b>{p.product?.title || 'Sample book'}</b>
              </td>
              <td>{numberWithCommas(p.product?.price || 0)}</td>
              <td>{p.count}</td>
              <td>{numberWithCommas(p.count * (p.product?.price || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >
      Tải xuống PDF
    </PDFDownloadLink>
  );

  const showEachOrders = () =>
    orders.reverse().map((order, i) => (
      <div key={i} className="m-5 p-3 card" style={{ width: '100%' }}>
        {showOrderInTable(order)}
        {order.coupon && (
          <div className="ml-auto mb-2">
            <div className="prod-coupon">
              <span className="prod-coupon-scissors">✂</span>
              <span className="prod-coupon-code">{order.coupon}%</span>
            </div>
          </div>
        )}
        <div className="ml-auto mt-2 mb-3 d-flex align-items-center">
          <span className="mr-2">Tổng cộng: </span>
          <span className="prod-price-sm">
            {numberWithCommas(order.paymentIntent?.amount || 0)} VNĐ
          </span>
        </div>
        {/* <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div> */}
        <hr />
        <h5>Thông tin giao hàng</h5>
        <div className="shipping-info">
          <ul style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
            <li>Người nhận: {order.recipientName || ''}</li>
            <li>Địa chỉ: {order.address || ''}</li>
            <li>Số điện thoại: {order.phone || ''}</li>
          </ul>
        </div>
      </div>
    ));

  return (
    <div style={{ minHeight: 'calc(100vh - 210px)', width: '100%' }}>
      <h4 className="mt-4 text-bold">
        {orders.length > 0 ? 'Đơn hàng của bạn' : 'Bạn chưa có đơn hàng nào'}
      </h4>
      <div className="row" style={{ width: '100%' }}>
        {orders && showEachOrders()}
      </div>
    </div>
  );
};

export default History;
