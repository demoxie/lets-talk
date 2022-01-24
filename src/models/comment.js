let mongoose = require('mongoose')
let { Schema } = mongoose

let Comment = Schema({
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post.id' },
  commenter: { type: Schema.Types.ObjectId, ref: 'User.id' },
  likers: [{ type: Schema.Types.ObjectId, ref: 'User.id' }],
  commenters: [{ type: Schema.Types.ObjectId, ref: 'User.id' }],
  createAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Comment', Comment)
