const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')

const { Station } = require('./../models/station')

const {
  stations,
  populateStations
} = require('./seed/stationsSeed')

beforeEach(populateStations)

describe('GET /stations', () => {
  it('should get all stations', (done) => {
    request(app)
      .get('/stations')
      .expect(200)
      .expect((res) => {
        expect(res.body.stations.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /stations/:id', () => {
  it('should return station document', (done) => {
    request(app)
      .get(`/stations/${stations[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.station.name).toBe(stations[0].name)
      })
      .end(done)
  })

  it('should return 404 if station not found', (done) => {
    let aHexId = new ObjectID().toHexString()
    request(app)
      .get(`/stations/${aHexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids station not found', (done) => {
    request(app)
      .get('/stations/123')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /stations/:id', () => {
  it('should remove a station', (done) => {
    let hexId = stations[1]._id

    request(app)
      .delete(`/stations/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.station._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Station.findById(hexId).then((station) => {
          expect(station).toBeFalsy()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return 404 if station not found', (done) => {
    let aHexId = new ObjectID().toHexString()
    request(app)
      .delete(`/stations/${aHexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    let aHexId = 'aInvalidId'
    request(app)
      .delete(`/stations/${aHexId}`)
      .expect(404)
      .end(done)
  })
})

describe('POST /stations', () => {
  it('should create a station', (done) => {
    let name = 'stationTest'

    request(app)
      .post('/stations')
      .send({ name })
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBeTruthy()
        expect(res.body.name).toBe(name)
        expect(Array.isArray(res.body.cars)).toBeTruthy()
        expect(res.body.cars.length).toBe(0)
      })
      .end((err) => {
        if (err) {
          console.log(err.message)
          return done(err)
        }

        Station.find().then((stations) => {
          expect(stations.length).toBe(3)
        })

        Station.findOne({ name }).then((station) => {
          expect(station).toBeTruthy()
          expect(station.name).toBe(name)
          expect(Array.isArray(station.cars)).toBeTruthy()
          expect(station.cars.length).toBe(0)
          done()
        }).catch((e) => {
          done(e)
        })
      })
  })

  it('should NOT create a station with an already taken name', (done) => {
    let alreadyUsedName = 'stationOne'

    request(app)
      .post('/stations')
      .send({ alreadyUsedName })
      .expect(400)
      .expect((res) => {
        expect(res.body.alreadyUsedName).toBeFalsy()
      })
      .end((err) => {
        if (err) {
          console.log(err.message)
          return done(err)
        }

        Station.find().then((stations) => {
          expect(stations.length).toBe(2)
          done()
        }).catch((e) => {
          done(e)
        })
      })
  })
})

describe('PATCH /stations/:id', () => {
  it('should update the station', (done) => {
    let name = 'This should be the new name'

    request(app)
      .patch(`/stations/${stations[0]._id}`)
      .send({
        name
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.station.name).toBe(name)
      })
      .end(done)
  })

  it('should return 404 if station not found', (done) => {
    let aHexId = new ObjectID()
    request(app)
      .patch(`/stations/${aHexId}`)
      .expect(404)
      .end(done)
  })
})
