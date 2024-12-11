const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  tour_id: {
    type: String,
    ref: 'Tours',
    required: true
  },
  user_id: {
    type: String,
    ref: 'Users',
    required: true
  },
  rating: {
    type: Number,
    default:0,
    required: true
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  ratingDate: {
    type: Date,
    default: Date.now
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
},
}, { versionKey: false });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
