import React, { useState, useEffect } from 'react';
import {
  fetchProductsByFilter,
  getProducts,
  getProductsCount,
} from '../functions/product';
import { getCategories } from '../functions/category';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import { Menu, Slider, Checkbox } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Star from '../components/forms/Star';
import Pagination from '../components/pagination/Pagination';
import Search from '../components/forms/Search';

const { SubMenu, ItemGroup } = Menu;
const formatter = (value) => `${value} VND`;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState('');
  const [sub, setSub] = useState('');
  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  const [page, setPage] = useState(1);
  const PERPAGE = 12;

  useEffect(() => {
    loadAllProducts();
    // fetch categories
    getCategories().then((res) => setCategories(res.data));
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
      setProductsCount(res.data.length);
    });
  };

  // 1. load products by default on page load
  const loadAllProducts = () => {
    getProducts('createdAt', 'desc', page, PERPAGE).then((res) => {
      setProducts(res.data);
      getProductsCount().then((res) => setProductsCount(res.data));
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    console.log('ok to request');
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });

    // reset
    setCategoryIds([]);
    setPrice(value);
    setStar('');
    setSub('');
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. load products based on category
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  // handle check for categories
  const handleCheck = (e) => {
    // reset
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setStar('');
    setSub('');
    // console.log(e.target.value);
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);
    // console.log(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating
  const handleStarClick = (num) => {
    // console.log(num);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(num);
    setSub('');
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  return (
    <div className="container pt-3">
      <div className="row">
        <div className="col-md-3 pt-2">
          <Menu
            mode="inline"
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
          >
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Tên sách
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>
                <Search />
              </div>
            </SubMenu>
            {/* price */}
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Giá
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tooltip={{
                    formatter,
                  }}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="2000000"
                />
              </div>
            </SubMenu>

            {/* category */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Thể loại
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>{showCategories()}</div>
            </SubMenu>

            {/* stars */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Đánh giá
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>{showStars()}</div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? <h4 className="text-danger">Loading...</h4> : ''}

          {products.length < 1 ? (
            <p>Không tìm thấy sản phẩm</p>
          ) : (
            <h4 className="text-bold">
              Cửa hàng: tìm thấy {productsCount} sản phẩm
            </h4>
          )}

          <div className="row five-column pb-3">
            {products.map((p) => (
              <div
                key={p._id}
                className="mt-3 col-md-4 col-xl-3 col-md-6 col-lg-4 col-sm-6"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="pro-pagination-style text-center mt-30 mb-5">
            {products.length < 1 ? (
              ''
            ) : (
              <Pagination
                current={page}
                totalRecord={productsCount}
                pageSize={PERPAGE}
                handleClick={(value) => setPage(value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
