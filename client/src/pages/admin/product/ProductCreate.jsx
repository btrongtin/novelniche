import { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createProduct } from '../../../functions/product';
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import { getCategories } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import { getAuthors } from '../../../functions/author';

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    authors: [],
    author: '',
    shipping: 'Yes',
    quantity: '50',
    images: [
        // {
        //   public_id: "jwrzeubemmypod99e8lz",
        //   url:
        //     "https://res.cloudinary.com/dcqjrwaoi/image/upload/v1599480909/jwrzeubemmypod99e8lz.jpg",
        // },
        // {
        //   public_id: "j7uerlvhog1eic0oyize",
        //   url:
        //     "https://res.cloudinary.com/dcqjrwaoi/image/upload/v1599480912/j7uerlvhog1eic0oyize.jpg",
        // },
        // {
        //   public_id: "ho6wnp7sugyemnmtoogf",
        //   url:
        //     "https://res.cloudinary.com/dcqjrwaoi/image/upload/v1599480913/ho6wnp7sugyemnmtoogf.jpg",
        // },
    ],
};

const ProductCreate = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    // redux
    const { user } = useSelector((state) => ({ ...state }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('DATAAA: ', values);
        createProduct(values, user.token)
            .then((res) => {
                console.log(res);
                window.alert(`"${res.data.title}" is created`);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                // if (err.response.status === 400) toast.error(err.response.data);
                toast.error(err.response.data.err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCatagoryChange = (e) => {
        e.preventDefault();
        console.log('CLICKED CATEGORY', e.target.value);
        setValues({ ...values, category: e.target.value });
    };

    const handleAuthorChange = (e) => {
        e.preventDefault();
        console.log('CLICKED AUTHOR', e.target.value);
        setValues({ ...values, author: e.target.value });
    };

    return (
        <div className="">
            {loading ? (
                <LoadingOutlined className="text-danger h1" />
            ) : (
                <h4>Product create</h4>
            )}
            <hr />

            {/* {JSON.stringify(values.images)} */}

            <div className="p-3">
                <FileUpload
                    values={values}
                    setValues={setValues}
                    setLoading={setLoading}
                />
            </div>

            <ProductCreateForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                setValues={setValues}
                values={values}
                handleCatagoryChange={handleCatagoryChange}
                handleAuthorChange={handleAuthorChange}
            />
        </div>
    );
};

export default ProductCreate;
