
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  profile_img: { type: String,  default: null  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'agent','admin'], required: true },
  phone: { type: String, required: true },
  address: { type: String, default: null },
  dob: { type: String, default: null },
  status: { type: String, enum: ['active','deactive'], default:'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
},
  { versionKey: false });



const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;
