import React, { useEffect } from 'react';
import { Select } from 'antd';
import { getCategories } from '../../functions/category';
import { getAuthors } from '../../functions/author';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';

const { Option } = Select;

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  setValues,
  values,
  handleCatagoryChange,
  handleAuthorChange,
  setLoading,
}) => {
  // destructure
  const {
    title,
    description,
    price,
    // categories,
    category,
    // authors,
    author,
    shipping,
    quantity,
    images,
  } = values;

  const handleDescriptionChange = (event, editor) => {
    setValues({ ...values, description: editor.getData() });
  };
  useEffect(() => {
    // loadCategories();
    // loadAuthors();
    if (values.categories.length > 0 || values.authors.length > 0) return;
    async function getData() {
      try {
        const categoriesData = await getCategories();
        const authorsData = await getAuthors();
        console.log('GOT DATA: ', categoriesData.data, authorsData.data);
        setValues({
          ...values,
          categories: categoriesData.data,
          authors: authorsData.data,
        });
      } catch (error) {
        console.log('ERR WHEN LOAD DATA: ', error);
      }
    }

    getData();
  }, [description]);

  return (
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
                  onReady={(editor) => {
                    editor.editing.view.change((writer) => {
                      writer.setStyle(
                        'min-height',
                        '200px',
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
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
                  onChange={handleCatagoryChange}
                >
                  <option>Please select</option>
                  {values.categories.length > 0 &&
                    values.categories.map((c) => (
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
                >
                  <option>Please select</option>
                  {values.authors.length > 0 &&
                    values.authors.map((c) => (
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
                <label className="text-muted text-bold">Số lượng còn</label>
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
    //end
  );
};

export default ProductCreateForm;
