import { useEffect, useState } from 'react';
import { getProducts, getProductsCount } from '../../../functions/product';
import { removeProduct } from '../../../functions/product';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ConfigProvider, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import ProductFilter from '../../../components/product/ProductFilter';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useToasts } from 'react-toast-notifications';

const MySwal = withReactContent(Swal);
const AllProducts = () => {
  const PAGE_SIZE = 8;
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { addToast } = useToasts();
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProducts('title', 'asc', page, PAGE_SIZE)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleRemove = (slug, name) => {
    MySwal.fire({
      title: `Xác nhận sản phẩm ${name}?`,
      text: 'Hành động này sẽ không thể khôi phục.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6e7881',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        removeProduct(slug, user.token)
          .then((res) => {
            loadAllProducts();
            addToast(`Đã xóa sản phẩm ${res.data.title}`, {
              appearance: 'warning',
              autoDismiss: true,
            });
          })
          .catch((err) => {
            if (err.response.status === 403)
              addToast(`Lỗi: Bạn không có quyền thực hiện hành động này!`, {
                appearance: 'error',
                autoDismiss: true,
              });
          });
      }
    });
  };

  return (
    <div className="">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <>
          <h4 className="text-bold">Tất cả sản phẩm</h4>
          <p className="text-bold">{productsCount} sản phẩm</p>
        </>
      )}
      <div className="row mt-5">
        <Link
          to="/admin/product"
          className="btn btn-primary mb-3 mr-3"
          style={{ marginLeft: 'auto' }}
        >
          Tạo mới
        </Link>
      </div>
      <ProductFilter
        setProducts={setProducts}
        setProductsCount={setProductsCount}
      />
      <table className="table table-striped ">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tên sách</th>
            <th scope="col">Ảnh</th>
            <th scope="col">Tác giả</th>
            <th scope="col">Danh mục</th>
            <th scope="col">Giá</th>
            <th scope="col">Đã bán</th>
            <th scope="col">Số lượng còn</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <th scope="row">
                <Link to={`/admin/product/${product.slug}`}>
                  {product._id
                    .toString()
                    .substr(product._id.toString().length - 8)}
                </Link>
              </th>
              <td>
                <Link to={`/admin/product/${product.slug}`}>
                  {product.title}
                </Link>
              </td>
              <td>
                <div className="product-img-sm">
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="box-img"
                  />
                </div>
              </td>
              <td>{product.author?.name || 'chưa có tác giả'}</td>
              <td>{product.category?.name || 'chưa có danh mục'}</td>
              <td>{product.price}</td>
              <td>{product.sold}</td>
              <td>{product.quantity}</td>
              <td>
                <i
                  className="fa fa-trash"
                  aria-hidden="true"
                  style={{
                    fontSize: '2rem',
                    color: 'red',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRemove(product.slug, product.title)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pro-pagination-style text-center mt-30 mb-5">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#498374',
            },
          }}
        >
          {products.length < 1 ? (
            ''
          ) : (
            <Pagination
              current={page}
              defaultCurrent={1}
              total={productsCount}
              pageSize={PAGE_SIZE}
              onChange={(value) => setPage(value)}
            />
          )}
        </ConfigProvider>
      </div>
    </div>
  );
};

export default AllProducts;
