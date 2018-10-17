const express = require('express')
const path = require('path')
const app = express()

const bodyParser = require('body-parser')
const multer = require('multer')

const port = 8770
const server = app.listen(port, () => {
    console.log(`Server on port http://localhost:${port}/!`)
})
const io = require('socket.io').listen(server)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/upload', (req, res) => {
    console.log(req.body)
    res.send('for uploading imgs');
})

io.on('connection', socket => {
    console.log('a user connected!')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('chat message', (from, msg) => {
        console.log('I received a private message by ', from, ' saying ', msg);
        socket.broadcast.emit('chat message', from, msg)
    })
})

app.use('/vue-chat', express.static('../dist/vue-chat/'))