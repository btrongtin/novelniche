const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');

exports.orders = async (req, res) => {
  try {
    const {
      sort = '-createdAt',
      order,
      page,
      perPage,
      startDate,
      endDate,
    } = req.body;
    const currentPage = page || 1;
    const limit = perPage || 12; //
    let allOrders = [];
    if (startDate && endDate) {
      allOrders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
        .skip((currentPage - 1) * perPage)
        .sort(sort)
        .populate('products.product')
        .populate('orderedBy')
        .limit(limit)
        .lean();
    } else {
      allOrders = await Order.find({})
        .skip((currentPage - 1) * perPage)
        .sort(sort)
        .populate('products.product')
        .populate('orderedBy')
        .limit(limit)
        .lean();
    }
    res.json(allOrders);
  } catch (error) {
    console.log(error);
  }
};

exports.ordersCount = async (req, res) => {
  let total = await Order.find({}).estimatedDocumentCount().lean();
  res.json(total);
};

exports.orderById = async (req, res) => {
  let order = await Order.findById(req.params.orderId)
    .populate('products.product')
    .populate('orderedBy')
    .lean();
  res.json(order);
};

exports.getOrderById = async (orderId) => {
  let order = await Order.findById(orderId).populate('products.product').lean();
  return order;
};

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;
  try {
    let updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    ).lean();

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

exports.getDashboard = async (req, res) => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const totalOrder = await Order.countDocuments();
  const totalCompletedOrder = await Order.find({
    orderStatus: 'Completed',
  }).countDocuments();
  const totalUser = await User.countDocuments();
  const totalNewUser = await User.find({
    createdAt: {
      $gte: new Date().setDate(new Date().getDate() - 30),
    },
  }).countDocuments();
  const totalProduct = await Product.countDocuments();
  const totalNewProduct = await Product.find({
    createdAt: {
      $gte: new Date().setDate(new Date().getDate() - 30),
    },
  }).countDocuments();
  const totalIncomeThisMonth = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(year, month),
          $lt: new Date(year, month + 1),
        },
      },
    },
    { $group: { _id: null, amount: { $sum: '$paymentIntent.amount' } } },
  ]);
  const totalPurchasedOrder = await Order.find({
    $or: [
      { 'paymentIntent.status': 'Payment success' },
      { orderStatus: 'Completed' },
    ],
  }).countDocuments();
  const topUsersWithMostOrders = await Order.aggregate([
    {
      $group: {
        _id: '$orderedBy',
        totalOrders: { $sum: 1 },
      },
    },
    {
      $sort: { totalOrders: -1 },
    },
    {
      $limit: 3,
    },
  ]);
  const userIds = topUsersWithMostOrders.map((item) => item._id);
  const topOrderUsersRaw = await User.find({ _id: { $in: userIds } }).lean();
  const topOrderUsers = topOrderUsersRaw.map((e, i) => ({
    ...e,
    totalOrders: topUsersWithMostOrders[i].totalOrders,
  }));
  const recentProduct = await Product.findOne().sort('-_id').lean();
  const topSellingProduct = await Product.find()
    .sort({ sold: -1 })
    .populate('author')
    .limit(3)
    .lean();
  const incomeByMonth = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalAmount: { $sum: '$paymentIntent.amount' },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);
  const monthlyTotalAmounts = incomeByMonth.map((item) => ({
    month: item._id.month,
    totalAmount: item.totalAmount,
  }));
  const productCountByCategoryRaw = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        productCount: { $sum: 1 },
      },
    },
  ]);

  const categoryIds = productCountByCategoryRaw.map((item) => item._id);

  const categories = await Category.find({ _id: { $in: categoryIds } });

  const productCountByCategory = productCountByCategoryRaw.map((item) => {
    const category = categories.find((cat) => cat._id.equals(item._id));
    return {
      category: category.name,
      count: item.productCount,
    };
  });
  res.json({
    topCardData: {
      totalOrder,
      totalCompletedOrder,
      totalUser,
      totalNewUser,
      totalProduct,
      totalNewProduct,
      totalIncomeThisMonth,
      totalPurchasedOrder,
    },
    storeIncomeData: monthlyTotalAmounts,
    topSellingProductData: topSellingProduct,
    topOrderUserData: topOrderUsers,
    recentProduct,
    productDistributionData: productCountByCategory,
  });
};
