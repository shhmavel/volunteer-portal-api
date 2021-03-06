const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const UsersService = {
    hasUserWithUserName(db, email){
    return db('users')
        .where({ email })
        .first()
        .then(user => !!user)
    },
    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
          return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
          return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ')){
            return 'Password must not start or end with empty spaces'
        }
        if (password.endsWith(' ')){
          return 'Password must not start or end with empty spaces'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
      },
    hashPassword(password){
      return bcrypt.hash(password, 12)
    },
    validateEmail(email){
      if(!REGEX_EMAIL.test(email)){
        return 'Not a valid email'
      }
    },
    serializeUser(user){
        return {
            id: user.id,
            full_name: xss(user.full_name),
            email: xss(user.email),
        }
    },
    updateUser(knex, id, newFields){
      return knex('users')
        .where({ id })
        .update(newFields)
    },
}
module.exports = UsersService