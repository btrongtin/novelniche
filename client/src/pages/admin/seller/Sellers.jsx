import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import Orders from '../../../components/order/Orders';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { ConfigProvider, Pagination } from 'antd';
import {
  getEmployees,
  getSellersCount,
  getUsers,
  getUsersCount,
} from '../../../functions/user';
import { Link } from 'react-router-dom';
import { createNewEmployee } from '../../../functions/auth';
import { changeRole, changeUserState } from '../../../functions/admin';

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
    loadSellersCount();
  }, [page]);

  useEffect(() => {
    loadSellersCount();
  }, []);

  const loadSellersCount = () =>
    getSellersCount(user.token).then((res) => setUsersCount(res.data));

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

  const handleStateChange = (employeeId, state) => {
    changeUserState(employeeId, state, user.token)
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
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td className="text-muted text-bold" style={{ fontStyle: 'italic' }}>
        {user.lastLogin
          ? moment(user.lastLogin).format('DD/MM/YYYY - h:mm:ss a')
          : 'chưa đăng nhập'}
      </td>
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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateDuplicate = (email, users) => {
    for (let i = 0; i < users.length; i++)
      if (users[i].email === email) return false;
    return true;
  };

  const clearInput = () => {
    setNewEmployee({
      name: '',
      address: '',
      role: 'clerk',
      email: '',
    });
  };

  return (
    <>
      <h4 className="text-bold mb-5">Nhân Viên</h4>
      {users && (
        <>
          <p className="text-bold">{usersCount} nhân viên</p>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Đăng nhập lần cuối</th>
                <th scope="col">Quyền</th>
                <th scope="col">Trạng thái</th>
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
                  if (
                    !validateEmail(newEmployee.email) ||
                    !validateDuplicate(newEmployee.email, users)
                  ) {
                    addToast('Email không hợp lệ', {
                      appearance: 'error',
                      autoDismiss: true,
                    });
                    return;
                  }
                  createNewEmployee(user.token, newEmployee)
                    .then((res) => {
                      if (res.data.success) {
                        loadUsers();
                        loadSellersCount();
                        addToast('Thêm nhân viên thành công', {
                          appearance: 'success',
                          autoDismiss: true,
                        });
                        clearInput();
                      } else {
                        addToast('Có lỗi xảy ra khi thêm nhân viên', {
                          appearance: 'error',
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

export default Sellers;
