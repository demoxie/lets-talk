const postModel = require('../models/post')
const userModel = require('../models/user')
const createPost = async (req, res, next) => {
  const poster = await userModel.findById('61ec05737f7472bbe1b85940').exec()
  const post = new postModel({
    content: req.body.content,
    poster: poster,
  })

  await post.save((err) => {
    if (err) {
      res.json({ error: err })
    } else {
      res.json({ message: 'Post created', data: post })
    }
  })
}

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postModel.find()
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ message: err })
  }
}
const getPost = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.postId).exec()
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err })
  }
}

const updatePost = async (req, res, next) => {
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
const deletePost = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndRemove(req.params.postId)
    res.send({ message: 'Post deleted successfully!' })
  } catch (err) {
    res.status(404).json({ message: err })
  }
}
const likePost = async (req, res, next) => {
  const liker = await userModel.findById('61ec05737f7472bbe1b85940').exec()
  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.postId,
      { $addToSet: { likers: liker._id } },
      { new: true },
    )
    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(500).json(err)
  }
}
module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
}
