const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        // res.status(400).send("Create product failed");
        res.status(400).json({
            err: err.message,
        });
    }
};

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate({path: 'category', select: 'name'})
        .populate({path: 'author', select: 'name'})
        .sort([['createdAt', 'desc']])
        .lean();
    res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({
            slug: req.params.slug,
        });
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.staus(400).send('Product delete failed');
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate('category')
        .lean();
    console.log('PRODUCT: ', product)
    res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).lean();
        res.json(updated);
    } catch (err) {
        console.log('PRODUCT UPDATE ERROR ----> ', err);
        // return res.status(400).send("Product update failed");
        res.status(400).json({
            err: err.message,
        });
    }
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .lean();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
    // console.table(req.body);
    try {
        // createdAt/updatedAt, desc/asc, 3
        const { sort, order, page, perPage } = req.body;
        console.log('QUERY: ', sort, order, page, perPage)
        const currentPage = page || 1;
        const limit = perPage || 12; // 3

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate({path: 'category', select: 'name'})
            .populate({path: 'author', select: 'name'})
            .sort([[sort, order]])
            .limit(limit)
            .lean();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().lean();
    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).lean();
    const user = await User.findOne({ email: req.user.email }).lean();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).lean();
        console.log('ratingAdded', ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { 'ratings.$.star': star } },
            { new: true }
        ).lean();
        console.log('ratingUpdated', ratingUpdated);
        res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).lean();

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate({path: 'category'})
        .populate({path: 'postedBy', strictPopulate: false})
        .lean();

    res.json(related);
};

// SERACH / FILTER

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate({path: 'category', select: '_id name'})
        .populate({path: 'postedBy', select: '_id name', strictPopulate: false})
        .lean();

    res.json(products);
};

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate({ path: 'category', select: '_id name' })
            .populate({
                path: 'postedBy',
                select: '_id name',
                strictPopulate: false,
            })
            .lean();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate({
                path: 'category',
                select: '_id name',
            })
            .populate({
                path: 'postedBy',
                select: '_id name',
                strictPopulate: false,
            })
            .lean();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleStar = async (req, res, stars) => {
    try {
        const aggregates = await Product.aggregate([
            {
                $project: {
                    document: '$$ROOT',
                    floorAverage: {
                        $floor: { $avg: '$ratings.star' },
                    },
                },
            },
            { $match: { floorAverage: stars } },
        ]).limit(12);

        const aggregateIds = aggregates.map((item) => item._id);

        const products = await Product.find({ _id: { $in: aggregateIds } })
            .populate({
                path: 'category',
                select: '_id name',
            })
            .populate({
                path: 'postedBy',
                select: '_id name',
                strictPopulate: false,
            });

        res.json(products);
    } catch (error) {
        console.log('ERROR', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({ subs: sub })
        .populate({path: 'category', select: '_id name'})
        .populate({path: 'postedBy', select: '_id name', strictPopulate: false})
        .lean();

    res.json(products);
};

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate({path: 'category', select: '_id name'})
        .populate({path: 'postedBy', select: '_id name', strictPopulate: false})
        .lean();

    res.json(products);
};

const handleColor = async (req, res, color) => {
    const products = await Product.find({ color })
        .populate({path: 'category', select: '_id name'})
        .populate({path: 'postedBy', select: '_id name', strictPopulate: false})
        .lean();

    res.json(products);
};

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate({path: 'category', select: '_id name'})
        .populate({path: 'postedBy', select: '_id name', strictPopulate: false})
        .lean();

    res.json(products);
};

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } =
        req.body;

    if (query) {
        console.log('query --->', query);
        await handleQuery(req, res, query);
    }

    // price [20, 200]
    if (price !== undefined) {
        console.log('price ---> ', price);
        await handlePrice(req, res, price);
    }

    if (category) {
        console.log('category ---> ', category);
        await handleCategory(req, res, category);
    }

    if (stars) {
        console.log('stars ---> ', stars);
        await handleStar(req, res, stars);
    }

    if (sub) {
        console.log('sub ---> ', sub);
        await handleSub(req, res, sub);
    }

    if (shipping) {
        console.log('shipping ---> ', shipping);
        await handleShipping(req, res, shipping);
    }

    if (color) {
        console.log('color ---> ', color);
        await handleColor(req, res, color);
    }

    if (brand) {
        console.log('brand ---> ', brand);
        await handleBrand(req, res, brand);
    }
};
