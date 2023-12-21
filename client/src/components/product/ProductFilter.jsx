import { useEffect, useState } from 'react';
import { getCategories } from '../../functions/category';
import { getAuthors } from '../../functions/author';
import { BsSearch } from 'react-icons/bs';

const ProductFilter = () => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filter, setFilter] = useState({ author: '', category: '', title: '' });

  useEffect(() => {
    loadCategories();
    loadAuthors();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => {
      setCategories(c.data);
    });
  const loadAuthors = () =>
    getAuthors().then((c) => {
      setAuthors(c.data);
    });

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setFilter({ ...filter, subs: [] });
  };
  const handleAuthorChange = (e) => {
    e.preventDefault();
    setFilter({ ...filter, author: e.target.value });
  };

  return (
    <div className="row">
      <div className="col-md-7 col-lg-7">
        <div className="d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên sách..."
          />
          <div className="input-group mb-4">
            <select
              name="category"
              className="form-control"
              onChange={handleCategoryChange}
            >
              <option>Danh mục</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <select
              name="author"
              className="form-control"
              onChange={handleAuthorChange}
            >
              <option>Tác giả</option>
              {authors.length > 0 &&
                authors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div
            className="btn btn-primary"
            style={{ width: '2.5rem', height: '2.5rem' }}
          >
            <BsSearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
