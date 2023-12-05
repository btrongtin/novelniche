const admin = require('../firebase');
const User = require('../models/user');
const { WEIGHTED_ROLES } = require('../utils/const');

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    // console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (err) {
    console.log('ERR AUTHOR: ', err);
    res.status(401).json({
      err: 'Invalid or expired token',
    });
  }
};

/// LỖI LÀ DO BÊN MIDDLEWARE AUTH, REQ.USER GỌI TRONG AUTH CHECK, MỘT SỐ ROUTE ADMIN KHÔNG CẦN AUTHCHECK => KHÔNG CÓ REQ.USER, SEEMS LIKE AUTH CHECK & ADMIN CHECK ĐI CHUNG

exports.adminCheck = (weight) => {
  return async (req, res, next) => {
    try {
      const { email } = req.user;
      const adminUser = await User.findOne({ email }).lean();
      const userWeight = WEIGHTED_ROLES[adminUser.role];
      console.log('WEIGHT: ', userWeight, weight);
      console.log('URL:', req.url);
      if (userWeight >= weight) {
        return next();
      }
      res.status(403).json({
        err: 'Admin resource. Access denied.',
      });
    } catch (err) {
      next(err);
    }
  };
};
