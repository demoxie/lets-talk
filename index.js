let debug = require('debug')
let app = require('./app')
const connectDB = require('./src/server/db')
require('dotenv').config()

// const listen = app.listen(process.env.DB_PORT, () => {
//   debug(
//     `server is running on port ${process.env.DB_PORT} and in ${process.env.DB_MODE} mode`,
//   )
//   console.log(
//     `server is running on port ${process.env.DB_PORT} and in ${process.env.DB_MODE} mode`,
//   )
// })

connectDB()
  .then(() => {
    app.listen(process.env.DB_PORT, () => {
      debug(
        `server is running on port ${process.env.DB_PORT} and in ${process.env.DB_MODE} mode`,
      )
      console.log(
        `server is running on port ${process.env.DB_PORT} and in ${process.env.DB_MODE} mode`,
      )
    })
  })
  .catch((error) => {
    console.log(error)
  })
module.exports = connectDB
