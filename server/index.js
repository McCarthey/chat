const express = require('express')
const path = require('path')
const app = express()

const bodyParser = require('body-parser')
const multer = require('multer')
const session = require('express-session')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, '../uploads')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage }) // for parsing multipart/form-data

/**
 * 连接mongodb，将数据库对象存放在全局变量db中
 */
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
app.use(session({
    secret: 'random key',
    name: 'chat_app_sid',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 }
})) // using session

// 检查是否已经登录过
app.get('/checkLogin', (req, res) => {
    if (req.session.login) {
        res.send({
            code: 0,
            msg: 'You have logged in'
        });
    } else {
        res.send({
            code: 999,
            msg: 'Please log in first'
        });
    }
});

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.send(`http://10.0.21.16:8770/uploads/${req.file.filename}`);
})

// 注册
app.post('/signUp', async (req, res) => {
    let data = req.body
    const isExisted = await checkUsername(data.username)
    if (isExisted) {
        res.send({
            code: 101,
            msg: 'Username already exists'
        })
    } else {
        const md5 = crypto.createHash('md5')
        const pwdMd5 = md5.update(data.password).digest('hex') // 得到加密后的密码
        const uid = generateId(data.username)
        const dbResult = await db.collection('users').insertOne({
            username: data.username,
            password: pwdMd5,
            uid
        })
        res.send({
            code: 0,
            msg: 'Success!'
        })
    }
})

// 登录
app.post('/login', async (req, res) => {
    let data = req.body
    const isExisted = await checkUsername(data.username)
    if (!isExisted) {
        res.send({
            code: 102,
            msg: 'No such user, please sign up first'
        })
    } else {
        const md5 = crypto.createHash('md5')
        const pwdMd5 = md5.update(data.password).digest('hex') // 得到加密后的密码
        const dbResult = await db.collection('users').findOne({
            username: data.username,
        })
        // console.log(dbResult.username)
        const { username, password, uid } = dbResult
        if (password === pwdMd5) {
            req.session.login = 'Logged'
            res.cookie('uid', uid)
            res.send({
                code: 0,
                msg: 'Login successfully'
            })
        } else {
            res.send({
                code: 103,
                msg: 'Invalid username or password'
            })
        }
    }
})

// 退出登录
app.post('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send({
                code: 998,
                msg: 'log out failed'
            })
            return
        }
        res.clearCookie('uid')
         res.send({
             code: 0,
             msg: 'Log out successfully'
         })
    })
})

app.get('/test', (req, res) => {
    res.send({
        code: 0,
        msg: 'Hello this is a test'
    })
})

// 检查用户名
async function checkUsername(username) {
    let queryRes = await db.collection('users').find({ username }).toArray()
    let isExisted = queryRes.some(i => {
        return i.username === username
    })
    return isExisted
}

// 生成唯一的userId
function generateId(data) {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest('hex')
}

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