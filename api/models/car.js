const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 50,
    trim: true,
    default: 'default'
  },
  available: {
    type: Boolean,
    default: true
  }
})

const Car = mongoose.model('Car', carSchema)

module.exports = { Car }