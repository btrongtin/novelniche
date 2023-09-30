import { useEffect, useState } from 'react';
import { getProducts } from '../../functions/product';
import ProductCard from '../cards/ProductCard';
import LoadingCard from '../cards/LoadingCard';

const FeatureProducts = ({ filterBy, size, spaceBottomClass }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // sort, order, limit
    getProducts(filterBy, 'desc', 1, size).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row five-column">
            {products.map((product) => (
              <div
                key={product._id}
                className="col-md-4 col-xl-3 col-md-6 col-lg-4 col-sm-6"
              >
                <ProductCard
                  product={product}
                  spaceBottomClass={spaceBottomClass}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FeatureProducts;
