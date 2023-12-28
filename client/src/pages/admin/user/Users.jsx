import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Orders from '../../../components/order/Orders';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { ConfigProvider, Pagination } from 'antd';
import { getUsers, getUsersCount } from '../../../functions/user';
import { Link } from 'react-router-dom';
import { changeUserState, searchUserByName } from '../../../functions/admin';
import { useToasts } from 'react-toast-notifications';
import { BsSearch } from 'react-icons/bs';

const Users = () => {
  const PAGE_SIZE = 6;
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [usersCount, setUsersCount] = useState(0);
  const [page, setPage] = useState(1);
  const { addToast } = useToasts();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page]);

  useEffect(() => {
    getUsersCount(user.token).then((res) => setUsersCount(res.data));
  }, []);

  const loadUsers = () =>
    getUsers(user.token, 'name', 'asc', page, PAGE_SIZE).then((res) => {
      setUsers(res.data);
    });
  const handleStateChange = (userId, state) => {
    changeUserState(userId, state, user.token)
      .then(() => {
        addToast('Cập nhật thành công', {
          appearance: 'success',
          autoDismiss: true,
        });
        loadUsers();
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 403) {
          addToast(`Lỗi: Bạn không có quyền thực hiện hành động này`, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  };

  const showUsersInTable = (user, index) => (
    <tr key={user._id}>
      <td>{index + 1}</td>
      <td>
        <Link to={`/admin/users/${user._id}`} className="text-bold">
          {' '}
          {user.name}
        </Link>
      </td>
      <td>{user.email}</td>
      <td>
        {user.lastLogin
          ? moment(user.lastLogin).format('DD/MM/YYYY - h:mm:ss a')
          : ''}
      </td>
      <td>
        <select
          className="form-control"
          defaultValue={user.state || 'active'}
          onChange={(e) => handleStateChange(user._id, e.target.value)}
        >
          <option value="active">Đang đoạt động</option>
          <option value="disabled">Ngưng kích hoạt</option>
        </select>
      </td>
    </tr>
  );

  const handleSearch = () => {
    searchUserByName(searchQuery, user.token).then((res) => {
      setUsers(res.data);
      setUsersCount(res.data.length);
    });
  };

  return (
    <>
      <h4 className="text-bold">Khách hàng</h4>
      <p className="text-bold mb-5">{usersCount} khách hàng</p>
      {users && (
        <>
          <div className="mb-3" style={{ width: '30%' }}>
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên khách hàng..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <div
                className="btn btn-primary"
                style={{ width: '2.5rem', height: '2.5rem' }}
                onClick={handleSearch}
              >
                <BsSearch />
              </div>
            </div>
          </div>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">Email</th>
                <th scope="col">Đăng nhập lần cuối</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>{users.map((user, i) => showUsersInTable(user, i))}</tbody>
          </table>
        </>
      )}

      <div className="pro-pagination-style text-center mt-30 mb-5">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#498374',
            },
          }}
        >
          {users.length < 1 ? (
            ''
          ) : (
            <Pagination
              current={page}
              defaultCurrent={1}
              total={usersCount}
              pageSize={PAGE_SIZE}
              onChange={(value) => setPage(value)}
            />
          )}
        </ConfigProvider>
      </div>
    </>
  );
};

export default Users;
