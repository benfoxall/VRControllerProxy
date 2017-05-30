const express = require('express')
const app = express()
const {ExpressPeerServer} = require('peer')

app.use(express.static('static'))
app.use(express.static('node_modules/milligram/dist'))

const server = app.listen(9000 || process.env.port)

const options = {
    debug: true
}

app.use('/api', ExpressPeerServer(server, options))
