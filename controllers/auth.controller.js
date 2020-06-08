const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user.model');
const config = require('../config/config');
const errorHandler = require('../helpers/dbErrorHandler');

const signup = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({ message: 'Successfully signed up' });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) { return res.status('401').json({ error: 'User not found' }); }
    if (!user.authenticate(req.body.password)) {
      return res.status('401').json({ error: "Email and password don't match" });
    }
    const token = jwt.sign({ _id: user.id }, config.jwtSecret);
    res.cookie('t', token, { expire: new Date() + 9999 });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status('401').json({ error: 'Could not login' });
  }
};

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status('200').json({
    message: 'signed out',
  });
};

const requireSignIn = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
});

const hasAuthorization = (req, res, next) => {
	const header = req.headers['authorization'];
	if (typeof header !== 'undefined') {
		const bearer = header.split(' ');
		const token = bearer[1];
		req.token = token;
		next();
	} else {
		return res.status('403').json({
			error: 'User is not authorized',
		});
	}

};


module.exports = {
  signup, login, signout, requireSignIn, hasAuthorization,
};
