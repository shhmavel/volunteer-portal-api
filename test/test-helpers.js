const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray(){
    return [
        {
            id: 1,
            full_name: 'Test User 1',
            email: 'email1@web.com',
            password: 'password'
        },
        {
            id: 2,
            full_name: 'Test User 2',
            email: 'email2@web.com',
            password: 'password'
        },
        {
            id: 3,
            full_name: 'Test User 3',
            email: 'email3@web.com',
            password: 'password'
        },
        {
            id: 4,
            full_name: 'Test User 4',
            email: 'email4@web.com',
            password: 'password'
        },
        {
            id: 5,
            full_name: 'Test User 5',
            email: 'email5@web.com',
            password: 'password'
        },
    ]
}

function makeUsersFixtures(){
    const testUsers = makeUsersArray()
    return { testUsers }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
              users`
        )
        .then(() => 
            Promise.all([
              trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`), 
              trx.raw(`SELECT setval('users_id_seq', 0)`),    
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
        makeAuthHeader,
        cleanTables
    }