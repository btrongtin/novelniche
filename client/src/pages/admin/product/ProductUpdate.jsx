import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getProduct, updateProduct } from '../../../functions/product';
import { getCategories } from '../../../functions/category';
import { getAuthors } from '../../../functions/author';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

const initialState = {
  title: '',
  description: '',
  price: '',
  category: '',
  author: '',
  shipping: '',
  quantity: '',
  images: [],
};

const ProductUpdate = () => {
  // state
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  // router
  let { slug } = useParams();

  useEffect(() => {
    // if (!values.title) {
    setLoading(true);
    loadProduct();
    loadCategories();
    loadAuthors();

    // }
  }, [slug]);

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      // console.log("single product", p);
      // 1 load single proudct
      console.log('PRODUCT: ', p.data);
      setValues({ ...values, ...p.data });
      setLoading(false);
    });
  };

  const loadCategories = () =>
    getCategories().then((c) => {
      setCategories(c.data);
    });
  const loadAuthors = () =>
    getAuthors().then((c) => {
      setAuthors(c.data);
    });
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
    setLoading(true);

    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        addToast(`Cập nhật sản phẩm thành công!`, {
          appearance: 'success',
          autoDismiss: true,
        });
        navigate('/admin/products');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        addToast(`Có lỗi xảy ra khi cập nhật sản phẩm!`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name, " ----- ", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [] });
    setSelectedCategory(e.target.value);
  };
  const handleAuthorChange = (e) => {
    e.preventDefault();
    setValues({ ...values, author: e.target.value });
  };

  const {
    title,
    description,
    price,
    category,
    author,
    shipping,
    quantity,
    images,
  } = values;
  const handleDescriptionChange = (event, editor) => {
    setValues({ ...values, description: editor.getData() });
  };

  return (
    <div className="">
      {loading ? (
        <LoadingOutlined className="text-danger h1" />
      ) : (
        <>
          <h4>Cập Nhật Thông Tin Sách</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-9 col-lg-9">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="card-title text-bold">Thông tin chung</div>
                    <div className="form-group">
                      <label className="text-muted text-bold">Tiêu đề</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={title}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-muted text-bold">Mô tả</label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={description}
                        onChange={handleDescriptionChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-lg-3">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="card-title text-bold">Danh mục</div>
                    <div className="form-group">
                      <label className="text-muted text-bold">Thể loại</label>
                      <select
                        name="category"
                        className="form-control"
                        onChange={handleCategoryChange}
                        value={
                          selectedCategory ? selectedCategory : category._id
                        }
                      >
                        {categories.length > 0 &&
                          categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="text-muted text-bold">Tác giả</label>
                      <select
                        name="author"
                        className="form-control"
                        onChange={handleAuthorChange}
                        value={author ? author._id : ''}
                      >
                        {authors.length > 0 &&
                          authors.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-9 col-lg-9">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="card-title text-bold">Đa phương tiện</div>
                    <div className="form-group">
                      <span className="text-muted text-bold mb-1 d-inline-block">
                        Hình ảnh
                      </span>
                      <div>
                        <FileUpload
                          values={values}
                          setValues={setValues}
                          setLoading={setLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-lg-3">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="card-title text-bold">Kho</div>
                    <div className="form-group">
                      <label className="text-muted text-bold">
                        Số lượng còn
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-9 col-lg-9">
                <div className="card shadow">
                  <div className="card-body">
                    <div className="card-title text-bold">Giá cả</div>
                    <div className="form-group">
                      <label className="text-muted text-bold">Giá bán</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <button className="btn btn-outline-info">Save</button>
          </form>
        </>
      )}

      {/* {JSON.stringify(values)} */}

      <hr />
    </div>
  );
};

export default ProductUpdate;
