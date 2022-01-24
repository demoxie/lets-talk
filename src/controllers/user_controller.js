const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const { use } = require('chai')

const createUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const user = new userModel({
    firstName: req.body.firstName,
    middleName: '',
    lastName: req.body.lastName,
    username: req.body.username,
    password: hashedPassword,
    dateOfBirth: new Date(req.body.dateOfBirth).toLocaleDateString(),
    gender: req.body.gender,
  })
  user
    .save()
    .then((doc) => res.status(201).send(doc))
    .catch((err) => res.status(409).json(err))
}
const loginUser = async (req, res, next) => {
  const user = await userModel.findOne({ username: req.body.username })
  if (user) {
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    )
    if (hashedPassword) {
      res.status(200).json({ message: 'login successful', data: user })
    }
    res.status(401).json({ message: 'Invalid password' })
  } else {
    res.status(500).json({ message: 'User does not exist' })
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(404).json({ message: err })
  }
}
const getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.userId).exec()
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ message: err })
  }
}

const updateUser = async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.params.userId,
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
const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndRemove(req.params.userId)
    res.send({ message: 'User deleted successfully!' })
  } catch (err) {
    res.status(404).json({ message: err })
  }
}
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
}
