import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  createAuthor,
  getAuthors,
  removeAuthor,
} from '../../../functions/author';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AuthorForm from '../../../components/forms/AuthorForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useToasts } from 'react-toast-notifications';

const MySwal = withReactContent(Swal);

const AuthorCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { addToast } = useToasts();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = () => getAuthors().then((c) => setAuthors(c.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createAuthor({ name }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName('');
        toast.success(`"${res.data.name}" is created`);
        loadAuthors();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug, name) => {
    MySwal.fire({
      title: `Xác nhận xóa tác giả ${name}?`,
      text: 'Hành động này sẽ không thể khôi phục.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6e7881',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        removeAuthor(slug, user.token)
          .then((res) => {
            setLoading(false);
            toast.error(`${res.data.name} deleted`);
            loadAuthors();
          })
          .catch((err) => {
            if (err.response.status === 403)
              addToast(`Lỗi: Bạn không có quyền thực hiện hành động này!`, {
                appearance: 'warning',
                autoDismiss: true,
              });
            setLoading(false);
          });
      }
    });
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="">
      {loading ? (
        <h4 className="text-danger">Loading..</h4>
      ) : (
        <h4>Thêm tác giả</h4>
      )}

      <AuthorForm handleSubmit={handleSubmit} name={name} setName={setName} />

      {/* step 2 and step 3 */}
      <h4>{authors.length} Tác giả</h4>
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />

      {/* step 5 */}
      {authors.filter(searched(keyword)).map((c) => (
        <div className="alert alert-secondary" key={c._id}>
          {c.name}
          <span
            onClick={() => handleRemove(c.slug, c.name)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
          <Link to={`/admin/author/${c.slug}`}>
            <span className="btn btn-sm float-right">
              <EditOutlined className="text-warning" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AuthorCreate;
