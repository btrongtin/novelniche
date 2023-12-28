import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createProduct } from '../../../functions/product';
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import { getCategories } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import { getAuthors } from '../../../functions/author';
import { useToasts } from 'react-toast-notifications';

const initialState = {
  title: '',
  description: '',
  price: '',
  category: '',
  author: '',
  quantity: '50',
  images: [],
  categories: [],
  authors: [],
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  // redux
  const { user } = useSelector((state) => ({ ...state }));
  const checkHasEmptyProp = (obj) => {
    for (var key in obj) {
      if (obj[key] === '') {
        return true;
      }
    }
    return false;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkHasEmptyProp(values)) {
      addToast(`Vui lòng điền đầy đủ thông tin!`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    createProduct(values, user.token)
      .then((res) => {
        window.alert(`"${res.data.title}" is created`);
        addToast(`Thêm mới sách ${res.data.title} thành công`, {
          appearance: 'success',
          autoDismiss: true,
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        addToast(`Có lỗi xảy ra khi tạo sách.`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCatagoryChange = (e) => {
    e.preventDefault();
    console.log('CLICKED CATEGORY', e.target.value);
    setValues({ ...values, category: e.target.value });
  };

  const handleAuthorChange = (e) => {
    e.preventDefault();
    console.log('CLICKED AUTHOR', e.target.value);
    setValues({ ...values, author: e.target.value });
  };

  return (
    <div className="">
      {loading ? (
        <LoadingOutlined className="text-danger h1" />
      ) : (
        <h4>Tạo mới sách</h4>
      )}
      <hr />

      {/* {JSON.stringify(values.images)} */}

      {/* <div className="p-3">
        <FileUpload
          values={values}
          setValues={setValues}
          setLoading={setLoading}
        />
      </div> */}

      <ProductCreateForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        setValues={setValues}
        values={values}
        handleCatagoryChange={handleCatagoryChange}
        handleAuthorChange={handleAuthorChange}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ProductCreate;
