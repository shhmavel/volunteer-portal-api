const express = require('express')
const path = require('path')
const RacesService = require('./races-service.js')

const racesRouter = express.Router()
const jsonBodyParser = express.json()

racesRouter
    .route('/')
    .get((req, res, next) => {
        RacesService.getAllRaces(req.app.get('db'))
            .then(races => {
                res.json(races.map(RacesService.serializeRace))
            })
            .catch(next)
    })

    module.exports = racesRouter