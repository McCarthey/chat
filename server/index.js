const express = require('express')
const path = require('path')
const app = express()

const bodyParser = require('body-parser')
const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, '../uploads')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage }) // for parsing multipart/form-data

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
let db

MongoClient.connect(url, (err, client) => {
    db = client.db('chat')
})

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

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.send(`http://10.0.21.16:8770/uploads/${req.file.filename}`);
})

app.post('/signUp', async (req, res) => {
    console.log(req.body)
    let data = req.body
    const dbResult = await db.collection('users').insertOne({
        username: data.username,
        password: data.password
    })
    console.log(dbResult)
    
    res.send({
        code: 0,
        msg: 'Success!'
    })
})

io.on('connection', socket => {
    console.log('a user connected!')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('chat message', (from, msg, avatar) => {
        console.log('I received a message by ', from, ' saying ', msg, avatar);
        socket.broadcast.emit('chat message', from, msg, avatar)
    })
})

app.use('/vue-chat', express.static('../dist/vue-chat/'))
app.use('/uploads', express.static('../uploads/'))