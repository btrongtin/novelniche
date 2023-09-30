import React, { useEffect } from 'react';
import { Select } from 'antd';
import ReactQuill from 'react-quill';
import { getCategories } from '../../functions/category';
import { getAuthors } from '../../functions/author';

const { Option } = Select;

const ProductUpdateForm = ({
    handleSubmit,
    handleChange,
    setValues,
    values,
    handleCategoryChange,
    categories,
    selectedCategory,
    handleAuthorChange,
    authors,
    selectedAuthor,
    loadCategories,
    loadAuthors,
    loadProduct,
}) => {
    // destructure
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
    console.log('VALLL: ', values);
    useEffect(() => {
        // loadCategories();
        // loadAuthors();
        if (values.title) {
          console.log('HAVE TITLE', values.title)
          return;
        }
        console.log('DOESNT HAVE TITLE', values.title)
            async function getData() {
                try {
                    await loadCategories();
                    await loadAuthors();
                    // await loadProduct();
                } catch (error) {
                    console.log('ERR WHEN LOAD DATA: ', error);
                }
            }

            getData();
        
    }, [description]);
    const handleDescriptionChange = (e) => {
        handleChange({
            target: {
                name: 'description',
                value: e,
            },
        });
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>

            <div className="form-group">
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={price}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Shipping</label>
                <select
                    value={shipping === 'Yes' ? 'Yes' : 'No'}
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    className="form-control"
                    onChange={handleCategoryChange}
                    value={selectedCategory ? selectedCategory : category._id}
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
                <label>Author</label>
                <select
                    name="author"
                    className="form-control"
                    onChange={handleAuthorChange}
                    value={selectedAuthor ? selectedAuthor : author._id}
                >
                    {authors.length > 0 &&
                        authors.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            <br />
            <button className="btn btn-outline-info">Save</button>
        </form>
    );
};

export default ProductUpdateForm;
