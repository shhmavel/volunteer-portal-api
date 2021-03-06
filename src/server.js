require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { PORT, DB_URL } = require('./config')

const db = knex({
    client: 'pg',
    connection: DB_URL,
})
app.get('/api/*', (req, res) => {
    res.json({ok:true});
});

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});

