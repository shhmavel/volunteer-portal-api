const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Shifts Endpoints', function(){
    let db 

    const { testRaces, testShifts, testUsers } = helpers.makeShiftsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/shifts`, () => {
        context(`Given there are shifts in the database`, () => {
            beforeEach('insert races', () => {
                helpers.seedRaces(
                    db,
                    testRaces,
                )
            })
            it(`creates a shift, responding with 201 and the new shift`, () => {
                const newShift = {
                    name: 'Test new shift',
                    day: 'Saturday',
                    date: '2019-02-03T00:00:00.000Z',
                    time: 'test time',
                    race_id: 1
                }
                return supertest(app)
                    .post('/api/shifts')
                    .send(newShift)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.name).to.eql(newShift.name)
                        expect(res.body.date).to.eql(newShift.date)
                        expect(res.body.time).to.eql(newShift.time)
                        expect(res.body.day).to.eql(newShift.day)
                        expect(res.body.race_id).to.eql(newShift.race_id)
                        expect(res.headers.location).to.eql(`/api/shifts/${res.body.id}`)
                    })
                    .expect(res =>
                        db
                            .from('shifts')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.name).to.eql(newShift.name)
                                expect(row.time).to.eql(newShift.time)
                                expect(row.day).to.eql(newShift.day)
                                expect(row.race_id).to.eql(newShift.race_id)
                            })
                    )
            })
        })
    })

    describe(`GET /api/shifts`, () => {
        beforeEach('insert races', () => {
            helpers.seedRaces(
                db,
                testRaces,
            ).then(
                helpers.seedShifts(
                    db, 
                    testShifts,
                )
            )
        })
        it(`responds with 200 and all of the shifts`, () => {
            return supertest(app)
                .get('/api/shifts')
                .expect(200)
        })
    })

}) 
