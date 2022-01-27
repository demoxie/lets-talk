const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const emailService = require('../services/mail')
const templates = require('../templates/email_template')
require('dotenv').config()

const getToken = (username) =>
  jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })
const getRefreshToken = (username) =>
  jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })

const verifyToken = async (req, res, next) => {
  let token = req.headers['token']
  if (token === null)
    return res.status(403).json({ message: 'token not provided' })
  const newData = []
  const decode = await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, data) => {
      if (err) {
        return res.status(401).json(err)
      }
      // res.status(200).json(data)
      req.user = data
      next()
    },
  )
}

const verifyAccountToken = async (req, res, next) => {
  let token = req.params.token
  if (token === null)
    return res.status(403).json({ message: 'token not provided' })
  const newData = []
  const decode = await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, data) => {
      if (err) {
        return res.status(401).json(err)
      } else {
        return newData.push(data)
      }
    },
  )
  let user = newData[0].username
  if (!user.enabled) {
    const registeredUser = userModel.findOne(
      {
        username: user.username,
      },
      (err, oldUser) => {
        if (err) {
          return res
            .status(404)
            .json({ message: 'User not found or account activated already' })
        }
        oldUser.confirmation = ''
        oldUser.enabled = true
        oldUser.save((err, data) => {
          if (err) {
            res.status(409).json(err)
          }
          res.status(200).json({ message: 'Account activated successfully' })
        })
      },
    )
  } else {
    res.status(403).json({ message: 'Account activated already' })
  }
}
const verifyApiKey = (req, res, next) => {
  let accessToken =
    req.headers['authorization'] === process.env.ACCESS_TOKEN_SECRET

  if (!accessToken) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    next()
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
}
module.exports = {
  getToken,
  verifyToken,
  verifyAccountToken,
  getRefreshToken,
  verifyApiKey,
}
