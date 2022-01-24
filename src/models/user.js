let mongoose = require('mongoose')
let { Schema } = mongoose

let User = Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  middleName: { type: String, default: '' },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
  },
  password: { type: String, required: [true, 'password is required'] },
  dateOfBirth: {
    type: Date,
    required: [true, 'date of birth is required'],
    trim: true,
  },
  gender: { type: String, required: [true, 'gender is required'] },
  confirmation: { type: String, default: '' },
  enabled: { type: Boolean, default: false },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('User', User)
