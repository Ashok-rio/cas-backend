const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    RegNo: {
        type: String,
        uppercase: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

UserSchema.pre("save", async function (next) {
  
    if (this.password === undefined) {
      return next();
    }
    else if (this.isModified("password") || this.isNew ||this.password !== undefined) {
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

module.exports = new mongoose.model('User', UserSchema);