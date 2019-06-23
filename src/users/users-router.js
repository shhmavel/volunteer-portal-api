const express = require('express')
const path = require('path')
const UsersService = require('./users-service.js')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter 
.post('/', jsonBodyParser, (req, res, next) => {
    const { password , email, full_name } = req.body
    for(const field of ['full_name', 'email', 'password'])
      if(!req.body[field])
          return res.status(400).json({
              error: `Missing '${field}' in request body`
          })

    const passwordError = UsersService.validatePassword(password)

    if(passwordError)
        return res.status(400).json({ error: passwordError })
    if(!passwordError)
    return res.status(200).json()
    })
    
module.exports = usersRouter