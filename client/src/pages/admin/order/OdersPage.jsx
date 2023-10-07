import { useState, useEffect } from 'react';
import {
  getOrders,
  changeStatus,
  getOrdersBetweenDates,
  getOrdersCount,
} from '../../../functions/admin';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Orders from '../../../components/order/Orders';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfigProvider, Pagination } from 'antd';

const OrderPage = () => {
  const PAGE_SIZE = 6;
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [orderCount, setOrderCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [page]);

  useEffect(() => {
    getOrdersCount(user.token).then((res) => setOrderCount(res.data));
  }, []);

  const loadOrders = () =>
    getOrders(user.token, 'aaa', 'bbb', page, PAGE_SIZE).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then(() => {
      toast.success('Status updated');
      loadOrders();
    });
  };

  const handleOrdersFilter = async (e) => {
    e.preventDefault();
    const res = await getOrdersBetweenDates(user.token, startDate, endDate);
    console.log('DATARES: ', res.data);
    setOrders(res.data);
  };

  return (
    <>
      <h4>Orders</h4>
      <div className="my-3 d-flex align-items-center">
        <div className="overflow-hidden">
          <span>From</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="ml-3"
          />
        </div>
        <div className="overflow-hidden ml-3">
          <span>To</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="ml-3"
          />
        </div>
        <button className="btn btn-info ml-4" onClick={handleOrdersFilter}>
          Filter
        </button>
      </div>
      {/* {JSON.stringify(orders)} */}
      <Orders orders={orders} handleStatusChange={handleStatusChange} />

      <div className="pro-pagination-style text-center mt-30 mb-5">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#498374',
            },
          }}
        >
          {orders.length < 1 ? (
            ''
          ) : (
            <Pagination
              current={page}
              defaultCurrent={1}
              total={orderCount}
              pageSize={PAGE_SIZE}
              onChange={(value) => setPage(value)}
            />
          )}
        </ConfigProvider>
      </div>
    </>
  );
};

export default OrderPage;
