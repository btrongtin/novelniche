import { useEffect, useState } from 'react';
import { getProducts, getProductsCount } from '../../../functions/product';
import { removeProduct } from '../../../functions/product';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ConfigProvider, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import ProductFilter from '../../../components/product/ProductFilter';

const AllProducts = () => {
  const PAGE_SIZE = 8;
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
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
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"?, this action can not be undo`
      )
    ) {
      removeProduct(slug, user.token)
        .then((res) => {
          loadAllProducts();
          toast.error(`${res.data.title} is deleted`);
        })
        .catch((err) => {
          if (err.response.status === 400) toast.error(err.response.data);
          console.log(err);
        });
    }
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
            <th scope="col">Title</th>
            <th scope="col">Image</th>
            <th scope="col">Author</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Sold</th>
            <th scope="col">Quantity</th>
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
              <td>{product.author?.name}</td>
              <td>{product.category.name}</td>
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
