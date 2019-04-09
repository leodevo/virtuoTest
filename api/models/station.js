const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { Car } = require('./car')

const stationSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 50,
    trim: true
  },
  cars: [{
    type: Schema.ObjectId,
    ref: 'Car',
    required: true //this will prevent a Station model from being saved without a cars array.
  }]
})

const Station = mongoose.model('Station', stationSchema)

module.exports = { Station }
