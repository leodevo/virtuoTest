require('./config/config')
require('./db/mongoose')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const { ObjectID } = require('mongodb')

let { Station } = require('./models/station')

let app = express()

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

app.get('/stations', (req, res) => {
  Station.find()
    .then((stations) => {
      res.send({ stations })
    }, (e) => {
      res.status(400).send(e)
    })
})

// GET /stations /1234324
app.get('/stations/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Station.findOne({
    _id: id
  }).then((station) => {
    if (!station) {
      return res.status(404).send()
    } else {
      return res.send({ station })
    }
  }).catch((e) => {
    return res.status(400).send()
  })
})

app.delete('/stations/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Station.findOneAndDelete({
    _id: id
  }).then((station) => {
    if (!station) {
      return res.status(404).send()
    }

    return res.send({ station })
  }).catch((e) => {
    return res.status(400).send()
  })
})

app.patch('/stations/:id', (req, res) => {
  let id = req.params.id
  var body = _.pick(req.body, ['name'])

  console.log(id)

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Station.findOneAndUpdate(
    {
      _id: id
    }, { $set: body }, { new: true }).then((station) => {
      console.log(station)
    if (!station) {
      return res.status(404).send()
    }

    res.send({ station })
  }).catch((e) => {
    console.log(e)
    res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }

