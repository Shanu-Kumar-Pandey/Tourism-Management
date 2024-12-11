const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour_id: {
    type: String,
    ref: 'Tours',
    required: true
  },
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  bookingDate: {
    type: String,
    default: Date.now,
  },
  numberOfPeople: {
    type: Number,
    default: 1
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  passengerDetails: [],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  email: { 
    type: String,
    required: true
  },
  phone: { 
    type: String,
    required: true
  }
}, { versionKey: false });

const Bookings = mongoose.model('Bookings', bookingSchema);
module.exports = Bookings;


// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   tour_id: {
//     type: String,
//     ref: 'Tours',
//     required: true
//   },
//   user_id: {
//     type: String,
//     required: true
//   },
//   bookingDate: {
//     type: String,
//     default: Date.now,
//   },
//   numberOfPeople: {
//     type: Number,
//     default:1
//   },

//   totalAmount: {
//     type: Number,
//     default:0
//   },

//   passengerDetails:[],
//   status: {
//     type: String,
//     enum: ['Pending', 'Confirmed', 'Cancelled'],
//     default: 'Pending'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['Pending', 'Paid', 'Failed'],
//     default: 'Pending'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['Credit Card', 'Debit Card'],
//     required: true
//   },
//   notes: {
//     type: String,
//     default: ''
//   }
// },
//  { versionKey: false });

// const Bookings = mongoose.model('Bookings', bookingSchema);
// module.exports = Bookings;