import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategory, updateCategory } from '../../../functions/category';
import CategoryForm from '../../../components/forms/CategoryForm';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const CategoryUpdate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    loadCategory();
  }, []);

  const navigate = useNavigate();

  const loadCategory = () =>
    getCategory(slug).then((c) => setName(c.data.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateCategory(slug, { name }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName('');
        toast.success(`"${res.data.name}" is updated`);
        navigate('/admin/category');
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
        <h4>Cập nhật danh mục</h4>
      )}

      <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

      <hr />
    </div>
  );
};

export default CategoryUpdate;
