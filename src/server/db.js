let mongoose = require('mongoose')

require('dotenv').config()
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: 1,
  connectTimeoutMS: 30000,
}
connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST, options)

    // callback when connection to mongodb is open
    await mongoose.connection.once('open', function () {
      console.log('MongoDB database connection established successfully')
    })
  } catch (error) {
    console.log(error)
  }
}
module.exports = connectDB
