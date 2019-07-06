const express = require('express')
const path = require('path')
const ShiftsService = require('./shifts-service.js')
const { requireAuth } = require('../middleware/jwt-auth')

const shiftsRouter = express.Router()
const jsonBodyParser = express.json()

shiftsRouter
    .route('/')
    //.post(requireAuth, jsonBodyParser, (req, res, next) => {
    .post( requireAuth, jsonBodyParser, (req, res, next) => {
        const { name, day, date, time, race_id } = req.body
        const newShift = { name, day, date, time, race_id }

        for(const field of ['name', 'day', 'date', 'time', 'race_id'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        return ShiftsService.insertShift(
            req.app.get('db'),
            newShift
        )
            .then(shift => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${shift.id}`))
                .json(ShiftsService.serializeShift(shift))
            })
            .catch(next)    
    })

shiftsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        ShiftsService.getAllShifts(
            req.app.get('db'),
            req.query.user_id,
            req.query.race_id
        )
            .then(shifts => {
                res.json(shifts.map(ShiftsService.serializeShift))
      })
      .catch(next)
})

shiftsRouter
    .route('/:race_id')
    .all(requireAuth)
    .get((req, res, next) => {
        ShiftsService.getShiftsForRace(
            req.app.get('db'),
            req.params.race_id
        )
            .then(shifts => {
                res.json(shifts.map(ShiftsService.serializeShift))
            })
            .catch(next)
    })

shiftsRouter
    .route('/user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        ShiftsService.getShiftsForUser(
            req.app.get('db')
        )
    })
shiftsRouter
    .route('/:shift_id')
    .all(requireAuth)
    .patch(jsonBodyParser, (req, res, next) => {
        const { user_id } = req.body
        const  shiftToUpdate = { user_id }

        const numberOfValues = Object.values(shiftToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain a 'user_id'`
                }
            })

        ShiftsService.updateShift(
            req.app.get('db'),
            req.params.shift_id,
            shiftToUpdate
        )
            .then(numRowsAffected => {
                return res.status(200).json({
                    message: 'updated shift'
                })
            })
            .catch(next)
    })
    module.exports = shiftsRouter