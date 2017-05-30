const express = require('express')
const app = express()
const {ExpressPeerServer} = require('peer')

app.get('/', (req, res) => res.send('Hello world!'))

const server = app.listen(9000 || process.env.port)

const options = {
    debug: true
}

app.use('/api', ExpressPeerServer(server, options))
