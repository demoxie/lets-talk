require('dotenv').config()
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const emailService = require('../services/mail')
const templates = require('../templates/email_template')
const auth = require('../middleware/auth')
const jwt = require('json-web-token')
const { v4: uuidv4 } = require('uuid')
const createUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10)

  const {
    firstName,
    middleName,
    lastName,
    username,
    password,
    dateOfBirth,
    gender,
  } = req.body
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = new userModel({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    username: username,
    password: hashedPassword,
    dateOfBirth: dateOfBirth,
    gender: gender,
  })
  //create the access token with the shorter lifespan
  let accessToken = auth.getToken(user)

  //create the refresh token with the longer lifespan
  let refreshToken = auth.getRefreshToken(user)
  // Create token

  user.confirmation = uuidv4()
  const data = await user.save()
  if (data === null) {
    res.status(500).json(err)
  }
  const html = templates.template(accessToken)
  const sent = emailService.sendEmail(username, 'Account confirmation', html)
  if (sent) {
    res.status(201).json({
      message: 'Account sent check your email inbox to verify your account',
      data: data,
    })
    //send the access token to the client inside a cookie
    res.cookie('jwt', accessToken, { secure: true, httpOnly: true })
    res.send()
  } else {
    res.status(500).json({ err, message: 'Failed to send email' })
  }
}
const loginUser = async (req, res, next) => {
  const user = await userModel.findOne({ username: req.body.username })
  if (user) {
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (valid) {
      // Create token
      const token = await auth.getToken(user)

      res
        .status(200)
        .json({ message: 'login successful', token: token, user: user })
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
