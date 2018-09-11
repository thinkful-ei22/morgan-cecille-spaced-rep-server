'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  url: {type: String, required: true},
  country: {type: String, required: true}
});

module.exports = mongoose.model('Question', questionSchema);
