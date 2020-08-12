const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const pe = require('parse-error')
const config = require('./config/config')
mongoose.set('useCreateIndex', true)
const models = require('./models')
const app = express()

const PORT = process.env.PORT || 3200

app.use(logger('combined'))

app.use(cors())

app.use(bodyParser.json())

app.get('/', (req, res) => {
    return res.json({
        message: 'Hello! Welcome to CAS application.',
    })
})

const v1 = require('./routes/API')
app.use('/api', v1)

process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error))
    // throw error;
})

app.listen(PORT, () => {
    console.log('Server started on port', PORT)
})

