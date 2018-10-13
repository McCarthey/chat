const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 8770

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', socket => {
	console.log('a user connected!')
})

app.use('/vue-chat', express.static('../dist/vue-chat/'))

app.listen(port, () => {
	console.log(`Server on port http://localhost:${port}/!`)
})