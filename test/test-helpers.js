const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray(){
    return [
        {
            id: 1,
            full_name: 'Test User 1',
            email: 'email1@web.com',
            password: 'password',
            type: 'user',
            credits: 2
        },
        {
            id: 2,
            full_name: 'Test User 2',
            email: 'email2@web.com',
            password: 'password',
            type: 'user',
            credits: 0
        },
        {
            id: 3,
            full_name: 'Test User 3',
            email: 'email3@web.com',
            password: 'password',
            type: 'user',
            credits: 3
        },
        {
            id: 4,
            full_name: 'Test User 4',
            email: 'email4@web.com',
            password: 'password',
            type: 'user',
            credits: 5
        },
        {
            id: 5,
            full_name: 'Test User 5',
            email: 'email5@web.com',
            password: 'password',
            type: 'user',
            credits: 0
        },
    ]
}

function makeRacesArray(){
    return [
        {
            id:1,
            name:'Test Race 1'
        },
        {
            id:2,
            name:'Test Race 2'
        },
        {
            id:3,
            name:'Test Race 3'
        },
        {
            id:4,
            name:'Test Race 4'
        },
        {
            id:5,
            name:'Test Race 5'
        },
    ]
}

function makeShiftsArray(){
    return[
        {
            id:1,
            name: "Test new shift1",
            date: "2019-02-03T00:00:00.000Z",
            time: "test time1",
            day: "Saturday",
            race_name:'Test race 1',
            race_id: 1,
            
        },
        {
            id:2,
            name: "Test new shift2",
            date: "2019-02-03T00:00:00.000Z",
            time: "test time2",
            day: "Saturday",
            race_name:'Test race 1',
            race_id: 1,
            
        },
        {
            id:3,
            name: "Test new shift3",
            date: "2019-02-03T00:00:00.000Z",
            time: "test time3",
            day: "Saturday",
            race_name:'Test race 2',
            race_id: 2,
            
        },
        {
            id:4,
            name: "Test new shift4",
            date: "2019-02-03T00:00:00.000Z",
            time: "test time4",
            day: "Saturday",
            race_name:'Test race 3',
            race_id: 3,
            
        },
        {
            id:5,
            name: "Test new shift5",
            date: "2019-02-03T00:00:00.000Z",
            time: "test time5",
            day: "Saturday",
            race_name:'Test race 4',
            race_id: 4,
            
        },
    ]
}

function makeShiftsFixtures(){
    const testUsers = makeUsersArray()
    const testShifts = makeShiftsArray()
    const testRaces = makeRacesArray()
    return { testUsers, testShifts, testRaces }
}

function makeUsersFixtures(){
    const testUsers = makeUsersArray()
    return { testUsers }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
              users,
              shifts,
              races`
        )
        .then(() => 
            Promise.all([
              trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`), 
              trx.raw(`ALTER SEQUENCE shifts_id_seq minvalue 0 START WITH 1`), 
              trx.raw(`ALTER SEQUENCE races_id_seq minvalue 0 START WITH 1`), 
              trx.raw(`SELECT setval('users_id_seq', 0)`),
              trx.raw(`SELECT setval('shifts_id_seq', 0)`),
              trx.raw(`SELECT setval('races_id_seq', 0)`)    
            ])
        )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() =>
        //update the auto sequence to stay in sync
            db.raw(
            `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
    }

function seedShifts(db, shifts) {
    const preppedShifts = shifts.map(shift => ({
        ...shift,
    }))
    return db.into('shifts').insert(preppedShifts)
        .then(() =>
        //update the auto sequence to stay in sync
            db.raw(
            `SELECT setval('shifts_id_seq', ?)`,
                [shifts[shifts.length - 1].id],
            )
        )
    }

    function seedRaces(db, races) {
        const preppedRaces = races.map(race => ({
            ...race,
        }))
        return db.into('races').insert(preppedRaces)
            .then(() =>
            //update the auto sequence to stay in sync
                db.raw(
                `SELECT setval('races_id_seq', ?)`,
                    [races[races.length - 1].id],
                )
            )
        }

function seedRacesTables(db, shifts, races){
    return db.transaction(async trx => {
        await seedRacesTables(trx, races)
        await trx.into('shifts').insert(shifts)
        await trx.raw(
            `SELECT setval('shifts_id_seq', ?)`,
            [shifts[shifts.length - 1].id],
        )
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id}, secret, { 
      subject: user.email,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }

    module.exports = {
        makeUsersArray,
        makeUsersFixtures,
        seedUsers,
        seedShifts,
        makeAuthHeader,
        cleanTables,
        makeShiftsFixtures,
        makeShiftsArray,
        makeRacesArray,
        seedRaces,
    }