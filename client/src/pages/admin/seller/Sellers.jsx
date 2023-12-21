import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import Orders from '../../../components/order/Orders';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { ConfigProvider, Pagination } from 'antd';
import { getEmployees, getUsers, getUsersCount } from '../../../functions/user';
import { Link } from 'react-router-dom';
import { createNewEmployee } from '../../../functions/auth';
import { changeRole } from '../../../functions/admin';
import { BsFillTrash3Fill } from 'react-icons/bs';

const Sellers = () => {
  const PAGE_SIZE = 6;
  const { addToast } = useToasts();
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [usersCount, setUsersCount] = useState(0);
  const [page, setPage] = useState(1);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    address: '',
    role: 'clerk',
    email: '',
  });

  useEffect(() => {
    loadUsers();
  }, [page]);

  useEffect(() => {
    getUsersCount(user.token).then((res) => setUsersCount(res.data));
  }, []);

  const loadUsers = () =>
    getEmployees(user.token, 'name', 'asc', page, PAGE_SIZE).then((res) => {
      setUsers(res.data);
    });

  const handleRoleChange = (employeeId, role) => {
    changeRole(employeeId, role, user.token).then(() => {
      addToast('Cập nhật thành công', {
        appearance: 'success',
        autoDismiss: true,
      });
      loadUsers();
    });
  };

  const showUsersInTable = (user, index) => (
    <tr key={user._id}>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td dangerouslySetInnerHTML={{ __html: user.address }}></td>
      <td>
        <select
          className="form-control"
          defaultValue={user.role}
          onChange={(e) => handleRoleChange(user._id, e.target.value)}
        >
          <option value="admin">Quản lý</option>
          <option value="clerk">Nhân viên</option>
        </select>
      </td>
      <td>
        <BsFillTrash3Fill
          style={{ fontSize: '16px', color: 'red', cursor: 'pointer' }}
        />
      </td>
    </tr>
  );

  const onChangeNewEmployeeForm = (event) => {
    setNewEmployee({ ...newEmployee, [event.target.name]: event.target.value });
  };

  const checkHasEmptyProp = (obj) => {
    for (var key in obj) {
      if (obj[key] === '') {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <h4 className="text-bold mb-5">Nhân Viên</h4>
      {users && (
        <>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Địa chỉ</th>
                <th scope="col">Quyền</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => showUsersInTable(user, i))}

              <tr>
                <td></td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    onChange={onChangeNewEmployeeForm}
                    value={newEmployee.name}
                    required
                    name="name"
                  />
                </td>
                <td>
                  <input
                    type="email"
                    className="form-control"
                    onChange={onChangeNewEmployeeForm}
                    value={newEmployee.email}
                    required
                    name="email"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    onChange={onChangeNewEmployeeForm}
                    value={newEmployee.address}
                    name="address"
                  />
                </td>
                <td>
                  <select
                    name="role"
                    className="form-control"
                    onChange={onChangeNewEmployeeForm}
                    value={newEmployee.role}
                  >
                    <option value="admin">Quản lý</option>
                    <option value="clerk">Nhân viên</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 width-100">
            <div
              className="btn btn-primary float-right"
              onClick={() => {
                if (!checkHasEmptyProp(newEmployee)) {
                  createNewEmployee(user.token, newEmployee)
                    .then((res) => {
                      if (res.success) {
                        loadUsers();
                        addToast('Thêm nhân viên thành công', {
                          appearance: 'success',
                          autoDismiss: true,
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      addToast(err.message, {
                        appearance: 'error',
                        autoDismiss: true,
                      });
                    });
                } else {
                  addToast('Vui lòng điền đầy đủ thông tin', {
                    appearance: 'error',
                    autoDismiss: true,
                  });
                }
              }}
            >
              Thêm nhân viên
            </div>
          </div>
        </>
      )}

      {/* <div className="pro-pagination-style text-center mt-30 mb-5">
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
      </div> */}
    </>
  );
};

export default Sellers;
