const User = require('../models/user');
const Cart = require('../models/cart');
const moment = require('moment')
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const coupon = require('../models/coupon');
const querystring = require('qs');
const crypto = require('crypto');
require('dotenv').config();

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.vnpay = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).lean();
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
        orderedBy: user._id,
    }).lean();

    var ipAddr = req.ip || req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var orderId = crypto.randomBytes(20).toString('hex');
    // var orderInfo = `Thanh toán đơn hàng ${orderId}`;
    var orderInfo = `Thanh_toan_don_hang_${orderId}`;
    var orderType = 'billpayment';
    // var amount = req.body.amount;
    var bankCode = 'NCB';
    var redirectUrl = process.env.vnp_Url;

    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_TmnCode'] = process.env.vnp_TmnCode;
    vnp_Params['vnp_Amount'] = (totalAfterDiscount || cartTotal) * 100;
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_CreateDate'] = moment(new Date()).format('YYYYMMDDHHmmss');
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_ReturnUrl'] = process.env.vnp_Returnurl;
    vnp_Params['vnp_TxnRef'] = orderId;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });

    var hmac = crypto.createHmac('sha512', process.env.vnp_HashSecret);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    redirectUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    const result = { redirectUrl: redirectUrl };
    return res.json(result);
};
