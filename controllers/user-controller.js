const bcrypt = require("bcryptjs");
const { ObjectId } = require('mongodb'); 
const User = require("../models/user-model");
const HttpError = require("../models/error-model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//todo unsecured endpoint
const register = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Please fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    //! check if email is taken
    const emailExist = await User.findOne({ email: newEmail });
    if (emailExist) {
      return next(new HttpError("Email already exist.", 422));
    }
    //! check the password
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters long.", 422)
      );
    }

    if (password != password2) {
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
    res.status(201).json(`New user ${newUser.email} registered success`);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

//todo unsecured endpoint
const login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Please fill all the fields."));
    }
    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials.", 422)
    );
  }
};

//todo get user by id secured endpoint
const getUser = async function (req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(
        new HttpError(`User with the given id: ${id} not found.`, 404)
      );
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//todo secured endpoint
const getUsers = async function (req, res, next) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//todo secured endpoint
const editUser = async function (req, res, next) {
  try {
    const {name, email, currentPassword, newPassword, newConfirmPassword} = req.body;
    if(!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError('Please fill all the fields.'));
    }

    // get the user
    const user = await User.findById(req.user.id);
    if(!user) {
      return next(new HttpError("User not found", 403));
    }

    // make sure the new email not exist.
    const emailExist = await User.findOne({email});
    if(emailExist && (emailExist._id != req.user.id)) {
      return next(new HttpError('Email already exist.', 422));
    }
    // compare current pass => db pass
    const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
    if(!validateUserPassword) {
      return next(new HttpError('Invalid current password', 422));
    }
    // compare new password
    if(newPassword !== newConfirmPassword) {
      return next(new HttpError('New password do not much', 422));
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPaaword = await bcrypt.hash(newPassword, salt);

    // update user info db
    const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hashedPaaword}, {new: true});
    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//todo secured endpoint
const changeAvatar = async function (req, res, next) {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }
    // find user from the db
    const user = await User.findById(req.user.id);
    // remove the old avatar if the user have
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (error) => {
        if (error) {
          return next(new HttpError(error));
        }
      });
    }

    const {avatar} = req.files;
    //check the image size
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile image too big, Should be less then 500kb", 422)
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFileName = splittedFilename[0] +
      uuid() + "." + splittedFilename[splittedFilename.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (error) => {
        if (error) {
          return next(new HttpError(error));
        }
        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          {avatar: newFileName},
          {new: true}
        );
        if (!updatedAvatar) {
          return next(new HttpError("Avatar couldn't be changed.", 422));
        }
        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deleteUser = async function(req, res, next) {
  try {
    const {userId} = req.params;

    // Validate if id is a valid ObjectId
    if(!ObjectId.isValid(userId)) {
      return next(new HttpError("Invalid user ID", 422));
    }
    const result = await User.deleteOne({_id: new ObjectId(userId)});

    if(result.deletedCount === 0) {
      return next(new HttpError(`User with the given id: ${userId} not found.`, 404));
    }

    res.status(200).json(`User with ID ${userId} deleted successfully`)
  } catch (error) {
    return next(new HttpError(error));
  }
}

module.exports = {
  register,
  login,
  getUser,
  changeAvatar,
  editUser,
  getUsers,
  deleteUser
};
