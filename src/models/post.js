let mongoose = require('mongoose')
let { Schema } = mongoose

let Post = Schema({
  content: { type: String, required: [true, "Post can't empty"] },
  poster: { type: Schema.Types.ObjectId, ref: 'User.id' },
  likers: [{ type: Schema.Types.ObjectId, ref: 'User.id' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment.id' }],
  createAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Post', Post)
