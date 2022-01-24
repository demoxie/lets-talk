let express = require('express')
let all_routes = require('./src/routes/all_routes')

const cors = require('cors')

let morgan = require('morgan')
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(all_routes)
module.exports = app
