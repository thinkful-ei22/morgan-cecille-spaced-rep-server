'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  questionLevels: {type: Array, default: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
  filteredList: {type: Array, default: []}
});

userSchema.methods.serialize = function () {
  return {
    id: this._id,
    username: this.username
  };
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
