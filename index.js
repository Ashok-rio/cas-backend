'use strict';
const { networkInterfaces } = require('os');
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const pe = require('parse-error')
const CONFIG = require('./config/config')
mongoose.set('useCreateIndex', true)
const models = require('./models')
const app = express()

const PORT = CONFIG.port

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

const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
          results[name].push(net.address);
          const url = new URL(`http://${results.wlp1s0}:${CONFIG.port}`);
          console.log(`Server listening on ${url}`);
        }
    }
}

app.listen(PORT, () => {
    console.log('Server started on port', PORT)
})

