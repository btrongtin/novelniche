import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import DatePicker from 'react-datepicker';
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from '../../../functions/coupon';
import 'react-datepicker/dist/react-datepicker.css';
import { DeleteOutlined } from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';
import { getCategories } from '../../../functions/category';
import Select from 'react-select';
import { getProducts } from '../../../functions/product';
import makeAnimated from 'react-select/animated';
import LocalSearch from '../../../components/forms/LocalSearch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const CreateCouponPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [targetType, setTargetType] = useState('all');

  const { addToast } = useToasts();
  const [keyword, setKeyword] = useState('');
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllCoupons();
    loadAllCategories();
    loadAllProducts();
  }, []);

  const loadAllCoupons = () => getCoupons().then((res) => setCoupons(res.data));
  const loadAllCategories = () =>
    getCategories().then((res) => setCategories(res.data));
  const loadAllProducts = () =>
    getProducts('title', 'asc', undefined, -1).then((res) =>
      setProducts(res.data)
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const currentCoupon = coupons.map((e) => e.name);
    if (currentCoupon.includes(name)) {
      addToast(`Coupon "${name}" đã tồn tại`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    console.log('COUPON: ', {
      name,
      expiry,
      discount,
      selectedCategory,
      selectedProducts,
      description,
      targetType,
    });
    let target = '';
    if (targetType === 'category') target = selectedCategory;
    else if (targetType === 'product') {
      const handledProducts = selectedProducts.map((e) => e.value);
      target = handledProducts;
    }

    createCoupon(
      { name, expiry, discount, description, type: targetType, target },
      user.token
    )
      .then((res) => {
        setLoading(false);
        loadAllCoupons(); // load all coupons
        setName('');
        setDiscount('');
        setExpiry('');
        setDescription('');
        setTargetType('all');
        setSelectedCategory('');
        setSelectedProducts([]);
        addToast(`Coupon "${res.data.name}" đã tạo thành công`, {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((err) =>
        addToast(`Có lỗi xảy ra ${err.message}`, {
          appearance: 'error',
          autoDismiss: true,
        })
      );
  };

  const handleRemove = (couponId, couponName) => {
    MySwal.fire({
      title: `Xác nhận xóa coupon ${couponName}?`,
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
        removeCoupon(couponId, user.token)
          .then((res) => {
            loadAllCoupons(); // load all coupons
            setLoading(false);
            addToast(`Đã xóa coupon ${res.data.name}`, {
              appearance: 'warning',
              autoDismiss: true,
            });
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

  const handleTargetChange = (e) => {
    if (e.target.value === 'category') {
      setSelectedProducts([]);
      setSelectedCategory(categories[0]._id) || '';
    } else if (e.target.value === 'product') setSelectedCategory('');
    else {
      setSelectedCategory('');
      setSelectedProducts([]);
    }
    setTargetType(e.target.value);
  };

  const handleProductsChange = (selected) => {
    setSelectedProducts(selected);
  };

  let targetComponent = <></>;
  const animatedComponents = makeAnimated();

  if (targetType === 'category') {
    targetComponent = (
      <div className="row mt-3">
        <div className="col-md-12 col-lg-12">
          <label className="text-muted">Chọn danh mục</label>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
            value={selectedCategory}
            name="type"
          >
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    );
  } else if (targetType === 'product') {
    const options = products
      ? products.map((e) => ({ value: e._id, label: e.title }))
      : [];
    targetComponent = (
      <div className="row mt-3">
        <div className="col-md-12 col-lg-12">
          <label className="text-muted">Chọn sản phẩm </label>
          <Select
            options={options}
            isMulti
            components={animatedComponents}
            closeMenuOnSelect={false}
            value={selectedProducts}
            onChange={handleProductsChange}
          />
          ;
        </div>
      </div>
    );
  }
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Coupon</h4>}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 col-lg-6">
                <div className="form-group">
                  <label className="text-muted">Mã</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                {' '}
                <div className="form-group">
                  <label className="text-muted">Giảm giá (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    className="form-control"
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 col-md-8">
                <label className="text-muted">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  autoFocus
                  required
                />
              </div>

              <div className="col-lg-4 col-md-4">
                <div className="form-group w-100">
                  <label className="text-muted">Ngày hết hạn</label>
                  <br />
                  <DatePicker
                    className="form-control w-full"
                    selected={expiry}
                    value={expiry}
                    onChange={(date) => setExpiry(date)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-lg-12">
                <label className="text-muted">Đối tượng</label>
                <select
                  onChange={handleTargetChange}
                  className="form-control"
                  value={targetType}
                  name="type"
                >
                  <option value="all">Đơn hàng</option>
                  <option value="category">Danh mục</option>
                  <option value="product">Sản phẩm</option>
                </select>
              </div>
            </div>
            {targetComponent}

            <button className="btn btn-outline-primary mt-3">Tạo</button>
          </form>
        </div>
      </div>

      <br />

      <h4>{coupons.length} Coupons</h4>
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />

      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Mã</th>
            <th scope="col">Mô tả</th>
            <th scope="col">Ngày hết hạn</th>
            <th scope="col">Giảm giá (%)</th>
            <th scope="col">Đối tượng</th>
            <th scope="col"></th>
          </tr>
        </thead>

        <tbody>
          {coupons.filter(searched(keyword)).map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.description || ''}</td>
              <td>{new Date(c.expiry).toLocaleDateString()}</td>
              <td>{c.discount}%</td>
              <td>
                {c.affectedCategory
                  ? c.affectedCategory.name
                  : c.target.length >= 1
                  ? c.target.map((e) => (
                      <Link
                        className="d-block"
                        key={e.title}
                        to={`/admin/product/${e.slug}`}
                      >
                        {e.title}
                      </Link>
                    ))
                  : 'Đơn hàng'}
              </td>
              <td>
                <DeleteOutlined
                  onClick={() => handleRemove(c._id, c.name)}
                  className="text-danger pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateCouponPage;
