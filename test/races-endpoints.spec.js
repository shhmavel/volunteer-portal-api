const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Races Endpoints', function(){
    let db 

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

    describe(`GET /api/races`, () => {
        const testRaces = helpers.makeRacesArray();
        this.beforeEach('insert races', () => {
            helpers.seedRaces(
                db, 
                testRaces,
            )
        })

        it(`responds with 200 and all of the races`, () => {
            return supertest(app)
                .get('/api/races')
                .expect(200, testRaces)
        })
    })
})