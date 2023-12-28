import React, { useEffect, useState } from 'react';
import { getProduct, productStar } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { useSelector } from 'react-redux';
import { getRelated } from '../functions/product';
import ProductCard from '../components/cards/ProductCard';
import { useParams } from 'react-router-dom';
import SectionTitle from '../components/section-title/SectionTitle';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Product = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  let { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user's star
    }
  }, [product.ratings, user]);

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      // load related
      getRelated(res.data._id).then((res) => setRelated(res.data));
      console.log('PRODUCT: ', res.data);
    });
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    console.table(newRating, name);
    productStar(name, newRating, user.token).then((res) => {
      console.log('rating clicked', res.data);
      loadSingleProduct(); // if you want to show updated rating in real time
    });
  };

  return (
    <div className="container">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>

      {/* hereeee */}
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-4 justify-content-center"
        style={{ fontSize: '18px' }}
      >
        <Tab eventKey="home" title="Description">
          <p dangerouslySetInnerHTML={{ __html: product.description }}></p>

          {/* {product.description} */}
        </Tab>
        <Tab eventKey="profile" title="Info">
          <p>
            We based our evaluation of book condition on the following criteria:
          </p>
          <ul className="prod-details-info-list">
            <li>
              <b>New:</b> Just like it sounds. A brand-new, unused, unread copy
              in perfect condition.
            </li>
            <li>
              <b>Like New:</b> An apparently unread copy in perfect condition.
              Dust cover is intact; pages are clean and are not marred by notes
              or folds of any kind.
            </li>
            <li>
              <b>Very Good:</b> A copy that has been read, but remains in
              excellent condition. Pages are intact and are not marred by notes
              or highlighting, but may contain a neat previous owner name. The
              spine remains undamaged.
            </li>
            <li>
              <b>Good:</b> A copy that has been read, but remains in clean
              condition. All pages are intact, and the cover is intact. The
              spine may show signs of wear. Pages can include limited notes and
              highlighting, and the copy can include "From the library of"
              labels or previous owner inscriptions.
            </li>
            <li>
              <b>Acceptable:</b> A readable copy. All pages are intact, and the
              cover is intact (the dust cover may be missing). Pages can include
              considerable notes--in pen or highlighter--but the notes cannot
              obscure the text.
            </li>
          </ul>
        </Tab>
        <Tab eventKey="contact" title="Review">
          Review
        </Tab>
      </Tabs>

      {/* END TAB COMPONENT */}
      <SectionTitle
        titleText={'Sách tương tự'}
        positionClass="text-center"
        spaceBottomClass="mb-30"
      />

      <div className="product-area">
        <div className="row pb-5 five-column">
          {related.length ? (
            related.map((r) => (
              <div key={r._id} className="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                <ProductCard product={r} />
              </div>
            ))
          ) : (
            <div className="text-center col">No Products Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
