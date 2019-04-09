require('./config/config')
require('./db/mongoose')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

let { Station } = require('./models/station')

var app = express()

const port = process.env.PORT

app.use(bodyParser.json())

// TODO authentication ?

// POST /stations
app.post('/stations', (req, res) => {
  console.log('req.body : ', req.body)
  let station = new Station({
    name: req.body.name
  })

  station.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/', (req, res) => {
  console.log('req.body : ', req.body)
  console.log('yo')
  res.send({})
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }

