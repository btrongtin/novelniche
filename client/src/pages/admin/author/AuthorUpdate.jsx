import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAuthor, updateAuthor } from '../../../functions/author';
import AuthorForm from '../../../components/forms/AuthorForm';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AuthorUpdate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    loadAuthor();
  }, []);

  const navigate = useNavigate();

  const loadAuthor = () => getAuthor(slug).then((c) => setName(c.data.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateAuthor(slug, { name }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName('');
        toast.success(`"${res.data.name}" is updated`);
        navigate('/admin/author');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  return (
    <div className="">
      {loading ? (
        <h4 className="text-danger">Loading..</h4>
      ) : (
        <h4>Cập nhật tác giả</h4>
      )}

      <AuthorForm handleSubmit={handleSubmit} name={name} setName={setName} />

      <hr />
    </div>
  );
};

export default AuthorUpdate;
