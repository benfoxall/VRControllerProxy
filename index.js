const express = require('express')
const app = express()
const {ExpressPeerServer} = require('peer')

app.use(express.static('static'))
app.use(express.static('node_modules/milligram/dist'))
app.use(express.static('node_modules/peerjs/dist'))

app.get('/broadcast', (req, res) => res.sendFile(__dirname + '/static/broadcast.html'))
app.get('/connect', (req, res) => res.sendFile(__dirname + '/static/connect.html'))

const server = app.listen(process.env.PORT || 9000)

const options = {
    debug: true
}

app.use('/peer', ExpressPeerServer(server, options))
