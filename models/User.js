const mongoose = require("mongoose");
const { to, ReE, ReS, isNull, isEmpty } = require("../services/util.service");
const bcrypt = require("bcryptjs");
const CONFIG = require("../config/config");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  regNo: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  profileName: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
  },
  department: {
    type: String,
  },
  course: {
    type: String,
  },
  graduate: {
    type: String,
    enum: ["UG", "PG"],
  },
  profilePic: {
    type: String,
  },
  bus: {
    type: Boolean,
    default: false,
  },
  hostel: {
    type: Boolean,
    default: false,
  },
  mess: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  admin:{
    type:Boolean,
    default: false
  }
});

UserSchema.pre("save", async function (next) {
  if (this.password === undefined) {
    return next();
  } else if (
    this.isModified("password") ||
    this.isNew ||
    this.password !== undefined
  ) {
    let err, salt, hash;
    [err, salt] = await to(bcrypt.genSalt(10));
    if (err) TE(err.message, true);

    [err, hash] = await to(bcrypt.hash(this.password, salt));
    if (err) TE(err.message, true);

    this.password = hash;
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async function (pw) {
  let err, pass;
  if (!this.password) TE("password not set");
  [err, pass] = await to(bcrypt.compare(pw, this.password));
  if (err) TE(err);

  if (!pass) TE("Email & password does not match.");

  return this;
};

UserSchema.methods.getJWT = function () {
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  return (
    "Bearer " +
    jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, {
      expiresIn: expiration_time,
    })
  );
};

UserSchema.methods.toWeb = function () {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  delete json.password;

  return json;
};

module.exports = new mongoose.model("User", UserSchema);
