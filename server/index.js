const express = require('express')
const path = require('path')
const app = express()

const port = 8770
const server = app.listen(port, () => {
    console.log(`Server on port http://localhost:${port}/!`)
})
const io = require('socket.io').listen(server)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

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