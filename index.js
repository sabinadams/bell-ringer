const app    = require('express')(),
      server = require('http').Server(app),
      io     = require('socket.io')(server),
      cors   = require('cors')

// Holds socket connection
let globalSocket = null

// Sets server + socket connector to listen on port 3000
server.listen(3000)

app.use(cors())

// Endpoint that passes on the command to a rpi via sockets
app.post('/ding', (req, res) => {
    if (globalSocket != null) {
        globalSocket.emit('ding', { message: 'dinged' })
        res.send({ status: 200, success: true, message: 'Dinged a connected bell' })
    } else {
        res.send({ status: 200, success: false, message: 'No bells connected' })
    }
})

// Handles connections, creates a socket object and listens for responses
io.on('connection', socket => {
    console.log("Client Connected")
    globalSocket = socket
    socket.on('dingResponse', data => console.log(data))
})