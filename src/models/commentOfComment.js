let mongoose = require('mongoose')
let { Schema } = mongoose

let CommentOfComment = Schema({
  content: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post.id' },
  commentId: { type: Schema.Types.ObjectId, ref: 'Comment.id' },
  commenterId: { type: Schema.Types.ObjectId, ref: 'User.id' },
  createAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('CommentOfComment', CommentOfComment)
