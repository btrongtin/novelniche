import { useState, useEffect } from 'react';
import {
  getOrders,
  changeStatus,
  getOrderById,
} from '../../../functions/admin';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Orders from '../../../components/order/Orders';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import LoadingCard from '../../../components/cards/LoadingCard';

const OrderPage = () => {
  const [order, setOrder] = useState({});
  const { user } = useSelector((state) => ({ ...state }));
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [slug]);

  const loadOrder = () => {
    setLoading(true);
    getOrderById(user.token, slug).then((res) => {
      console.log('DATAAA: ', res.data);
      setOrder(res.data);
      setLoading(false);
    });
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then(() => {
      toast.success('Status updated');
      loadOrder();
    });
  };

  return (
    <>
      <h4>Orders detail</h4>
      {/* {JSON.stringify(orders)} */}
      {/* <Orders orders={orders} handleStatusChange={handleStatusChange} /> */}
      {loading ? (
        <LoadingCard count={3} />
      ) : (
        <>
          <div
            className="p-4 bg-white rounded-lg shadow"
            style={{ width: '100%' }}
          >
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <form>
                  <div className="form-group">
                    <label className="font-weight-bold">Order date</label>
                    <p>
                      {moment(order.createdAt).format(
                        'DD MMM YYYY - h:mm:ss a'
                      )}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Ordered by</label>
                    <p>{order.orderedBy?.name}</p>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Address</label>
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          order.address ||
                          order.orderedBy?.address ||
                          '96 Le Hong Phong',
                      }}
                    ></p>
                  </div>
                </form>
              </div>
              <div className="col-lg-4 col-md-4">
                <form>
                  <div className="form-group">
                    <label htmlFor="inputAddress" className="font-weight-bold">
                      Order status
                    </label>
                    <select
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="form-control text-sm badge badge-primary"
                      defaultValue={order.orderStatus}
                      style={{
                        width: '10rem',
                        display: 'block',
                      }}
                      name="status"
                    >
                      <option value="Not Processed">Not Processed</option>
                      <option value="Cash On Delivery">Cash On Delivery</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Order type</label>
                    <p>{order.paymentIntent?.payment_method_types[0]}</p>
                  </div>
                </form>
              </div>
              <div className="col-lg-4 col-md-4">
                <form>
                  <div className="form-group">
                    <label className="font-weight-bold">Payment status</label>
                    <p>{order.paymentIntent?.status}</p>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Coupon</label>
                    <p>{order.coupon ? order.coupon + '%' : 0}</p>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Total</label>
                    <p>{order.paymentIntent?.amount}</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <table className="table table-bordered mt-4">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Count</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>

            <tbody>
              {order.products &&
                order.products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.product?.title}</td>
                    <td>{product.product?.price}</td>
                    <td>{product.count}</td>
                    <td>{product.product?.price * product.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="ml-auto" style={{ width: '18rem' }}>
            <div className="d-flex align-item-center justify-content-between">
              <span className="font-weight-bold">Total</span>
              <span>
                {order.products?.reduce(
                  (accumulator, product) =>
                    accumulator + product.product.price * product.count,
                  0
                )}{' '}
                VND
              </span>
            </div>
            <div className="d-flex align-item-center justify-content-between">
              <span className="font-weight-bold">Coupon</span>
              <span>{order.coupon ? order.coupon + '%' : 0}</span>
            </div>
            <div className="d-flex align-item-center justify-content-between">
              <span className="font-weight-bold">Total Payable</span>
              <span>{order.paymentIntent?.amount} VND</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderPage;
