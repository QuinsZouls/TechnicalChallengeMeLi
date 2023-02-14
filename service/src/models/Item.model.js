const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  nickname: {
    type: String,
  },
});

const ItemModel = mongoose.model('Item', schema);

module.exports = ItemModel;
