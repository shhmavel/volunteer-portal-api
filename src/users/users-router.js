const express = require('express')
const path = require('path')
const UsersService = require('./users-service.js')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter 
.post('/', jsonBodyParser, (req, res, next) => {
    const { password , email, full_name, type, credits=0 } = req.body
    for(const field of ['full_name', 'email', 'password'])
      if(!req.body[field])
          return res.status(400).json({
              error: `Missing '${field}' in request body`
          })

    const passwordError = UsersService.validatePassword(password)

    if(passwordError)
        return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
        req.app.get('db'),
        email
    )
        .then(hasUserWithUserName => {
            if(hasUserWithUserName)
                return res.status(400).json({ error: `Email already taken` })

    return UsersService.hashPassword(password)
            .then(hashedPassword => {
                const newUser = {
                        email,
                        password: hashedPassword,
                        full_name,
                        type,
                        credits,
                    }

                    return UsersService.insertUser(
                        req.app.get('db'),
                        newUser
                    )
                        .then(user => {
                            res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                .json(UsersService.serializeUser(user))
                        })
                }) 
        })
        .catch(next)
})
usersRouter
    .route('/:user_id')
    .patch(jsonBodyParser, (req, res, next) => {
        const { credits } = req.body
        const userToUpdate = { credits }

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain credits`
                }
            })

        UsersService.updateUser(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )   
            .then(numRowsAffected => {
                return res.status(200).json({
                    message: 'updated user credits'
                })
            })
            .catch(next)
})
   
module.exports = usersRouter