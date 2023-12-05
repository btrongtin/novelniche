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

const Users = () => {
  const PAGE_SIZE = 6;
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [usersCount, setUsersCount] = useState(0);
  const [page, setPage] = useState(1);

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
      <td dangerouslySetInnerHTML={{ __html: user.address }}></td>
    </tr>
  );

  return (
    <>
      <h4 className="text-bold mb-5">Users</h4>
      {users && (
        <>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">Email</th>
                <th scope="col">Địa chỉ</th>
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
