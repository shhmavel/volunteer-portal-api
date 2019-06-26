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
        ShiftsService.getAllShifts(req.app.get('db'))
            .then(shifts => {
                res.json(shifts.map(ShiftsService.serializeShift))
      })
      .catch(next)
})

    module.exports = shiftsRouter