const express = require('express')
const path = require('path')
const ShiftsService = require('./shifts-service.js')
const { requireAuth } = require('../middleware/jwt-auth')

const shiftsRouter = express.Router()
const jsonBodyParser = express.json()

shiftsRouter
    .route('/')
    //.post(requireAuth, jsonBodyParser, (req, res, next) => {
    .post(jsonBodyParser, (req, res, next) => {
        console.log('hey we are tryign to add a new shift')
        const { name, day, date, time, race_id } = req.body
        const newShift = { name, day, date, time, race_id }

        for(const field of ['name', 'day', 'date', 'time', 'race_id'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

                ShiftsService.insertShift(
                    req.app.get('db'),
                    newShift
                )
                  .then(shift => {
                      res
                        .status(201)
                        .location(`/api/shifts/${shift.id}`)
                        .json(ShiftsService.serializeShift(shift))
                  })
                  .catch(next)    
    })

shiftsRouter
    .route('/')
    .get((req, res, next) => {
        console.log("req", req.query)
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
    .get((req, res, next) => {
        console.log('hey we are tryign to getby raceid')
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
    .get((req, res, next) => {
        console.log('hey we are tryign to getby userid')
        ShiftsService.getShiftsForUser(
            req.app.get('db')
        )
    })
shiftsRouter
    .route('/:shift_id')
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