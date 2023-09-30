const User = require('../models/user');

exports.createOrUpdateUser = async (req, res) => {
    const { name, picture, email } = req.user;

    const user = await User.findOneAndUpdate(
        { email },
        { name: email.split('@')[0], picture },
        { new: true }
    );
    if (user) {
        console.log('USER UPDATED', user);
        res.json(user);
    } else {
        const newUser = await new User({
            email,
            name: email.split('@')[0],
            picture,
        }).save();
        console.log('USER CREATED', newUser);
        res.json(newUser);
    }
};

exports.currentUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.json(user);
    } catch (error) {
        console.log(error);
        // res.status(500).json({
        //     success: false,
        //     message: 'Internal server error',
        // });
        throw new Error(err);
    }
};
