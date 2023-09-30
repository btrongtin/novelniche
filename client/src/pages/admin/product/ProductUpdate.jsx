import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getProduct, updateProduct } from '../../../functions/product';
import { getCategories } from '../../../functions/category';
import { getAuthors } from '../../../functions/author';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';

const initialState = {
    title: '',
    description: '',
    price: '',
    category: '',
    author: '',
    shipping: '',
    quantity: '',
    images: [],
};

const ProductUpdate = () => {
    // state
    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    const navigate = useNavigate();
    // router
    let { slug } = useParams();

    useEffect(() => {
        // if(values.title) {
        //     console.log('HAVE TITLE: ', values.title)
        //     return;
        // }else{
        //     console.log('DOESNT HAVE TITLE: ', values.title)
        //     loadProduct();
        //     loadCategories()
        //     loadAuthors()
        // }

        loadProduct();
        loadCategories();
        loadAuthors();
    }, []);
    const loadProduct = () => {
        getProduct(slug).then((p) => {
            // console.log("single product", p);
            // 1 load single proudct
            setValues({ ...values, ...p.data });
        });
    };

    const loadCategories = () =>
        getCategories().then((c) => {
            setCategories(c.data);
        });
    const loadAuthors = () =>
        getAuthors().then((c) => {
            setAuthors(c.data);
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        values.category = selectedCategory ? selectedCategory : values.category;
        values.author = selectedAuthor ? selectedAuthor : values.category;

        updateProduct(slug, values, user.token)
            .then((res) => {
                setLoading(false);
                toast.success(`"${res.data.title}" is updated`);
                navigate('/admin/products');
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                toast.error(err.response.data.err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        // console.log(e.target.name, " ----- ", e.target.value);
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('CLICKED CATEGORY', e.target.value);
        setValues({ ...values, subs: [] });

        setSelectedCategory(e.target.value);

        console.log('EXISTING CATEGORY values.category', values.category);

        // if user clicks back to the original category
        // show its sub categories in default
        // if (values.category._id === e.target.value) {
        //     loadProduct();
        // }
    };
    const handleAuthorChange = (e) => {
        e.preventDefault();
        console.log('CLICKED Author', e.target.value);
        setValues({ ...values, subs: [] });

        setSelectedAuthor(e.target.value);

        console.log('EXISTING AUTHOR values.author', values.author);

        // if user clicks back to the original author
        // show its sub categories in default
        // if (values.author._id === e.target.value) {
        //     loadProduct();
        // }
    };

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

    const handleDescriptionChange = (e) => {
        handleChange({
            target: {
                name: 'description',
                value: e,
            },
        });
    };

    return (
        <div className="">
            {loading ? (
                <LoadingOutlined className="text-danger h1" />
            ) : (
                <h4>Product update</h4>
            )}

            {/* {JSON.stringify(values)} */}

            <div className="p-3">
                <FileUpload
                    values={values}
                    setValues={setValues}
                    setLoading={setLoading}
                />
            </div>

            {/* <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        setValues={setValues}
                        values={values}
                        handleCategoryChange={handleCategoryChange}
                        handleAuthorChange={handleAuthorChange}
                        categories={categories}
                        authors={authors}
                        selectedCategory={selectedCategory}
                        selectedAuthor={selectedAuthor}
                        loadCategories={loadCategories}
                        loadAuthors={loadAuthors}
                        loadProduct={loadProduct}
                    /> */}
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
                    {/* <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={handleDescriptionChange}
                            /> */}
                    <input
                        type="text"
                        name="description"
                        className="form-control"
                        value={description}
                        onChange={handleChange}
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
                        value={
                            selectedCategory ? selectedCategory : category._id
                        }
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
            <hr />
        </div>
    );
};

export default ProductUpdate;
