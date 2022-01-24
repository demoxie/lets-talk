const postModel = require('../models/post')
const commentModel = require('../models/comment')
const commentOfCommentModel = require('../models/commentOfComment')
const userModel = require('../models/user')
const createComment = async (req, res, next) => {
  try {
    const commenter = await userModel.findById(req.body.userId).exec()
    const post = await postModel.findById(req.body.postId).exec()
    const comment = await commentModel({
      content: req.body.content,
      post: post,
      commenter: commenter,
    })

    await comment.save()
    const updatedPost = postModel
      .findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment },
      })
      .exec()
    res.status(200).json({ message: 'Comment created', data: comment })
  } catch (err) {}
}

const getAllCommentsForAPost = async (req, res, next) => {
  try {
    const comments = await commentModel
      .find()
      .where('post')
      .equals(req.params.postId)
    res.status(200).json(comments)
  } catch (err) {
    res.status(404).json({ message: err })
  }
}
const getComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.params.commentId)
    res.status(200).json(comment)
  } catch (err) {
    res.status(404).json({ message: err })
  }
}

const updateComment = async (req, res, next) => {
  const post = await postModel.findByIdAndUpdate(
    req.params.postId,
    { $set: req.body },
    function (err, data) {
      if (err) {
        res.status(405).json(err)
      } else {
        res.status(200).json(data)
      }
    },
  )
}
const deleteComment = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndRemove(req.params.postId)
    res.send({ message: 'Post deleted successfully!' })
  } catch (err) {
    res.status(404).json({ message: err })
  }
}
const likeComment = async (req, res, next) => {
  const commentLiker = await userModel.findById(req.body.userId).exec()
  try {
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      { $addToSet: { likers: commentLiker._id } },
      { new: true },
    )
    res.status(200).json(updatedComment)
  } catch (err) {
    res.status(500).json(err)
  }
}
const commentOnAComment = async (req, res, next) => {
  try {
    const commentCommenter = await userModel.findById(req.body.userId).exec()
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      { $push: { commenters: commentCommenter } },
    )

    const commentOfComment = await commentOfCommentModel({
      postId: req.body.postId,
      commentId: req.params.commentId,
      commenterId: req.body.userId,
      content: req.body.content,
    })
    await commentOfComment.save()
    res
      .status(200)
      .json({ comment: commentOfComment, initialComment: updatedComment })
  } catch (err) {
    res.status(500).json(err)
  }
}
module.exports = {
  createComment,
  getAllCommentsForAPost,
  getComment,
  updateComment,
  deleteComment,
  likeComment,
  commentOnAComment,
}
