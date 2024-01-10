const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const HttpError = require("../models/error-model");

//todo unsecured endpoint
const register = async function (req, res, next) {
  try {
    const { name, email, password, password2 } = req.body;
    if(!name || !email || !password) {
      return next(new HttpError("Please fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    //! check if email is taken
    const emailExist = await User.findOne({ email: newEmail });
    if(emailExist) {
      return next(new HttpError("Email already exist.", 422));
    }
    //! check the password
    if((password.strim()).length < 6) {
      return next(
       new HttpError("Password should be at least 6 characters long.", 422)
      );
    }

    if(password != password2) {
      return next(new HttpError("Password is not much", 422));
    }

    //! encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

//todo unsecured endpoint
const login = async function (req, res, next) {
  res.json("Login method");
};

//todo get user by id secured endpoint
const getUser = async function (req, res, next) {
  res.json("Get user by id method");
};

//todo secured endpoint
const changeAvatar = async function (req, res, next) {
  res.json("Change profile method");
};

//todo secured endpoint
const editUser = async function (req, res, next) {
  res.json("Update user method");
};

//todo secured endpoint
const getUsers = async function (req, res, next) {
  res.json("Get users method");
};

module.exports = {
  register,
  login,
  getUser,
  changeAvatar,
  editUser,
  getUsers,
};
