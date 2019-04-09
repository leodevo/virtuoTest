const { Station } = require('../../models/station')

const { ObjectId } = require('mongodb')

const stationOneId = new ObjectId()
const stationTwoId = new ObjectId()

const stationOne = {
  _id: stationOneId.toHexString(),
  name: 'stationOne',
  cars: []
}

const stationTwo = {
  _id: stationTwoId.toHexString(),
  name: 'stationTwo',
  cars: []
}

const stations = [
  stationOne,
  stationTwo
]

module.exports = {
  stationOne,
  stationTwo
}

const populateStations = (done) => {
  Station.deleteMany({}).then(() => {
    return Station.insertMany(stations)
  }).then(() => done())
}

module.exports = {
  stations,
  populateStations
}
