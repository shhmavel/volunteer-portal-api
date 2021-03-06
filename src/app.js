require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const shiftsRouter = require('./shifts/shifts-router')
const racesRouter = require('./races/races-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: 'info.log' })
        ]
    });

    if(NODE_ENV !== 'production'){
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
        if (req.method === "OPTIONS") {
          return res.send(204);
        }
        next();
      });

app.use(morgan(morganOption))
app.use(express.json()) 
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, world')
})
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/shifts', shiftsRouter)
app.use('/api/races', racesRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'} }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

module.exports = app