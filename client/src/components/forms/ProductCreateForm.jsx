import React, { useEffect } from 'react';
import { Select } from 'antd';
import ReactQuill from 'react-quill';
import { getCategories } from '../../functions/category';
import { getAuthors } from '../../functions/author';

const { Option } = Select;

const ProductCreateForm = ({
    handleSubmit,
    handleChange,
    setValues,
    values,
    handleCatagoryChange,
    handleAuthorChange,
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

    const handleDescriptionChange = (e)=> {
        handleChange({target: {
            name: 'description',
            value: e
        }})
    }
    useEffect(() => {
        // loadCategories();
        // loadAuthors();
        if(values.categories.length > 0 || values.authors.length > 0)
            return;
        async function getData() {
            try {
                const categoriesData = await getCategories();
                const authorsData = await getAuthors();
                console.log('GOT DATA: ', categoriesData.data,
                    authorsData.data,);
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
    console.log('VAL:: ', values)

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
                {/* <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={description}
                    onChange={handleChange}
                /> */}
                <ReactQuill theme="snow" value={description} style={{height:'160px',marginBottom:'2.5rem'}} onChange={handleDescriptionChange} />
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
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Please select</option>
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
                <label>Author</label>
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

            <br />
            <button className="btn btn-outline-info">Save</button>
        </form>
    );
};

export default ProductCreateForm;
