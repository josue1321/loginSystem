const express = require('express')
const app = express()
const path = require('path')

require('dotenv').config()

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to the database')
        app.listen(3000, () => {
            console.log('Listening on port 3000')
        })
    })
    .catch(err => {
        console.log(err)
    })

const session = require('express-session')

const MongoStore = require('connect-mongo')

const { v4: uuidv4 } = require('uuid')

app.set('trust proxy', 1)
app.use(session({
    genid: (req) => {
        return uuidv4();
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({
        clientPromise: new Promise((resolve) => {
            mongoose.connection.on("connected", () => {
                const client = mongoose.connection.getClient();
                resolve(client);
            });
        }),
        client: mongoose.connection.getClient(),
        dbName: process.env.DBNAME,
    })
}))

const cookieParser = require('cookie-parser')

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(express.urlencoded({ extended: false }))

const handlebars = require('express-handlebars')

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    extname: 'hbs',
    defaultLayout: 'index'
}));

app.use(express.static('public'))

app.get('/', (req, res) => {
    if (!req.session.auth) {
        return res.redirect('login')
    }

    res.render('main', { user: req.session.auth });
})

const loginRouter = require(path.join(__dirname, 'routes', 'loginRouter.js'))
const registerRouter = require(path.join(__dirname, 'routes', 'registerRouter.js'))
const logoutRouter = require(path.join(__dirname, 'routes', 'logoutRouter.js'))
const deleteRouter = require(path.join(__dirname, 'routes', 'deleteRouter.js'))

app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/logout', logoutRouter)
app.use('/delete', deleteRouter)