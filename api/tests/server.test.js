const expect = require('expect')
const request = require('supertest')

const { app } = require('./../server')

const { Station } = require('./../models/station')

const {
  stations,
  populateStations
} = require('./seed/stationsSeed')

beforeEach(populateStations)

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
