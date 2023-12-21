import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Orders from '../../../components/order/Orders';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { ConfigProvider, Pagination } from 'antd';
import {
  getUserDetail,
  getUsers,
  getUsersCount,
} from '../../../functions/user';
import { Link, useParams } from 'react-router-dom';
import {
  MdOutlineMailOutline,
  MdOutlineHouse,
  MdLocalPhone,
  MdOutlinePersonOutline,
} from 'react-icons/md';
import { SiDogecoin } from 'react-icons/si';
import { BsCart } from 'react-icons/bs';
import { FaBook } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { numberWithCommas } from '../../../utils';
import { changeStatus } from '../../../functions/admin';

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState({});
  const { user } = useSelector((state) => ({ ...state }));
  const auth = getAuth();

  let { userId } = useParams();

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = () => {
    getUserDetail(userId, user.token).then((res) => {
      setUserDetail(res.data);
      console.log('USER: ', res.data);
    });
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token)
      .then(() => {
        toast.success('Status updated');
        loadUser();
      })
      .catch((err) => {
        toast.error('Có lỗi xảy ra: ', err);
      });
  };

  const showOrderInTable = (order) => (
    <tr key={order._id}>
      <td>
        <Link to={`/admin/orders/${order._id}`}>
          <b>{order._id.toString().substr(order._id.toString().length - 8)}</b>
        </Link>
      </td>
      <td>{moment(order.createdAt).format('DD MMM YYYY - h:mm:ss a')}</td>
      <td>{numberWithCommas(order.paymentIntent.amount || 0)}</td>
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
      <h4 className="text-bold">Users</h4>
      {userDetail && (
        <div className="row">
          <div className="col-md-4 col-lg-4">
            <div className="card">
              <div className="">
                <div className="card-top text-center p-2">
                  <div className="card-top-cover w-100 rounded-lg"></div>
                  <div className="card-top-content">
                    <div className="user-avatar">
                      <img
                        src={
                          userDetail.photoURL ||
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1200px-User-avatar.svg.png'
                        }
                        className="card-img-top"
                        alt="user avatar"
                      />
                    </div>
                    <h4 className="card-title">
                      {userDetail.displayName || userDetail.name || 'username'}
                      {/* <span className="badge badge-success">New user</span> */}
                    </h4>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {userDetail.email}
                    </h6>
                  </div>
                </div>
                <div className="p-3 card-bottom">
                  <div className="user-info-list">
                    <div className="user-info-item flex-middle mb-3">
                      <div className="icon-background-holder bg-faded mr-3">
                        <MdOutlinePersonOutline size={'1.5rem'} />
                      </div>
                      <div className="flex-center">
                        <span className="text-bold text-muted d-block">
                          Mã khách hàng
                        </span>
                        <span className="text-bold d-block">
                          {userDetail._id || ''}
                        </span>
                      </div>
                    </div>
                    <div className="user-info-item flex-middle mb-3">
                      <div className="icon-background-holder bg-faded mr-3">
                        <MdOutlineMailOutline size={'1.5rem'} />
                      </div>
                      <div className="flex-center">
                        <span className="text-bold text-muted d-block">
                          Email
                        </span>
                        <span className="text-bold d-block">
                          {userDetail.email}
                        </span>
                      </div>
                    </div>
                    <div className="user-info-item flex-middle mb-3">
                      <div className="icon-background-holder bg-faded mr-3">
                        <MdLocalPhone size={'1.5rem'} />
                      </div>

                      <div className="flex-center">
                        <span className="text-bold text-muted d-block">
                          Số điện thoại
                        </span>
                        <span className="text-bold d-block">
                          {userDetail.phone || '0123 456 789'}
                        </span>
                      </div>
                    </div>
                    <div className="user-info-item flex-middle mb-3">
                      <div className="icon-background-holder bg-faded mr-3">
                        <MdOutlineHouse size={'1.5rem'} />
                      </div>
                      <div className="flex-center">
                        <span className="text-bold text-muted d-block">
                          Địa chỉ giao hàng
                        </span>
                        <span
                          className="text-bold d-block"
                          dangerouslySetInnerHTML={{
                            __html: userDetail.address || '',
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-8 col-lg-8"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div className="row" style={{ flexShrink: '0' }}>
              <div className="col-md-4 col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="icon-background-holder bg-pri mb-3">
                      <SiDogecoin size={'1.5rem'} className="icon-background" />
                    </div>
                    <h5 className="card-subtitle mb-2 text-muted text-bold">
                      Tích lũy mua hàng
                    </h5>
                    <h4 className="card-title">
                      {numberWithCommas(userDetail.ordersTotalValue || 0)} VNĐ
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="icon-background-holder bg-second mb-3">
                      <BsCart size={'1.5rem'} className="icon-background" />
                    </div>
                    <h5 className="card-subtitle mb-2 text-muted text-bold">
                      Tổng số đơn hàng
                    </h5>
                    <h4 className="card-title">
                      {userDetail.ordersCount || 0}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="icon-background-holder bg-third mb-3">
                      <FaBook size={'1.5rem'} className="icon-background" />
                    </div>
                    <h5 className="card-subtitle mb-2 text-muted text-bold">
                      Sản phẩm đã mua
                    </h5>
                    <h4 className="card-title">
                      {userDetail.orderTotalProdCount || 0}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ flex: '1' }}>
              <div className="col-lg-12 col-md-12">
                <div
                  className="card"
                  style={{
                    height: '24rem',
                    minHeight: '24rem',
                    overflowY: 'scroll',
                  }}
                >
                  <div className="card-header text-bold">Lịch sử mua hàng</div>
                  <div className="card-body">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Ngày đặt</th>
                          <th scope="col">Tổng tiền</th>
                          <th scope="col">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDetail.orders?.map((order) =>
                          showOrderInTable(order)
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetail;
