import supertest from 'supertest'
import app from '../../src/app.js'

const getDateInNumeric = (str) => {
  return new Date(str).getTime()
}

describe('success', () => {
  let server = null
  beforeEach((done) => {
    server = supertest(app)
    done()
  })

  it('should return valid response for valid input', () =>
    server
      .post('/records')
      .send({
        startDate: '2016-01-26',
        endDate: '2019-02-02',
        minCount: 4000,
        maxCount: 5000
      })
      .then((data) => {
        expect(data.statusCode).toEqual(200)
        expect(data.body.code).toEqual(0)
        expect(data.body.msg).toEqual('Success')
        expect(data.body.records.length).toEqual(532)
      }))

  it('should return records with totalCount between “minCount” and “maxCount”', () => {
    const inputParams = {
      startDate: '2016-01-26',
      endDate: '2019-02-02',
      minCount: 1000,
      maxCount: 1050
    }
    return server
      .post('/records')
      .send(inputParams)
      .then((data) => {
        expect(data.statusCode).toEqual(200)
        expect(data.body.code).toEqual(0)
        expect(data.body.msg).toEqual('Success')
        expect(data.body.records.length).toEqual(2)
        data.body.records.forEach((record) => {
          expect(record.totalCount).toBeGreaterThanOrEqual(inputParams.minCount)
          expect(record.totalCount).toBeLessThanOrEqual(inputParams.maxCount)
        })
      })
  })

  it('should return records with createdAt between “startDate” and “endDate”', () => {
    const inputParams = {
      startDate: '2016-01-26',
      endDate: '2019-02-02',
      minCount: 1000,
      maxCount: 1050
    }
    return server
      .post('/records')
      .send(inputParams)
      .then((data) => {
        expect(data.statusCode).toEqual(200)
        expect(data.body.code).toEqual(0)
        expect(data.body.msg).toEqual('Success')
        expect(data.body.records.length).toEqual(2)
        data.body.records.forEach((record) => {
          expect(record.totalCount).toBeGreaterThanOrEqual(inputParams.minCount)
          expect(record.totalCount).toBeLessThanOrEqual(inputParams.maxCount)
          expect(getDateInNumeric(record.createdAt)).toBeGreaterThanOrEqual(
            getDateInNumeric(inputParams.startDate)
          )
          expect(getDateInNumeric(record.createdAt)).toBeLessThanOrEqual(
            getDateInNumeric(inputParams.endDate)
          )
        })
      })
  })

  it('should return empty response for no data found', () =>
    server
      .post('/records')
      .send({
        startDate: '2001-01-26',
        endDate: '2002-02-02',
        minCount: 4000,
        maxCount: 5000
      })
      .then((data) => {
        expect(data.statusCode).toEqual(200)
        expect(data.body.code).toEqual(0)
        expect(data.body.msg).toEqual('Success')
        expect(data.body.records.length).toEqual(0)
      }))
})

describe('error', () => {
  let server = null
  beforeEach((done) => {
    server = supertest(app)
    done()
  })

  describe('validation', () => {
    it('should return error response for minCount greater then maxCount', () =>
      server
        .post('/records')
        .send({
          startDate: '2019-02-02',
          endDate: '2020-02-02',
          maxCount: 1000,
          minCount: 2000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual(
            '"maxCount" must be greater than or equal to ref:minCount'
          )
        }))

    it('should return error response for startDate greater then endDate', () =>
      server
        .post('/records')
        .send({
          startDate: '2020-02-02',
          endDate: '2019-02-02',
          maxCount: 5000,
          minCount: 1000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual(
            '"endDate" must be greater than or equal to "ref:startDate"'
          )
        }))

    it('should return error response for no minCount', () =>
      server
        .post('/records')
        .send({
          startDate: '2019-02-02',
          endDate: '2019-02-02',
          maxCount: 5000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('"minCount" is required')
        }))

    it('should return error response for no maxCount', () =>
      server
        .post('/records')
        .send({
          startDate: '2019-02-02',
          endDate: '2019-02-02',
          minCount: 4000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('"maxCount" is required')
        }))

    it('should return error response for no endDate', () =>
      server
        .post('/records')
        .send({
          startDate: '2019-02-02',
          minCount: 4000,
          maxCount: 5000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('"endDate" is required')
        }))

    it('should return error response for no startDate', () =>
      server
        .post('/records')
        .send({
          endDate: '2019-02-02',
          minCount: 4000,
          maxCount: 5000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('"startDate" is required')
        }))

    it('should return error response for invalid input', () =>
      server
        .post('/records')
        .send()
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('"startDate" is required')
        }))

    it('should return error response for any new input field', () =>
      server
        .post('/records')
        .send({
          newField: "abc",
          startDate: '2018-02-02',
          endDate: '2019-02-02',
          maxCount: 5000,
          minCount: 1000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(422)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('"newField" is not allowed')
        }))
  })

  describe('invalid route', () => {
    it('should return error response invalid route', () =>
      server
        .post('/record')
        .send({
          endDate: '2019-02-02',
          minCount: 4000,
          maxCount: 5000
        })
        .then((data) => {
          expect(data.statusCode).toEqual(404)
          expect(data.body.code).toEqual(1)
          expect(data.body.msg).toEqual('Route not found')
        }))
  })
})
