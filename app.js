require('dotenv').config()

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express')
const app = express()

// connectDB
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/auth')
const contactsRouter = require('./routes/contacts')
const authenticateUser = require('./middleware/authentication')

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/auth', authRouter)
app.use('/contacts', authenticateUser, contactsRouter)

// error handler
app.use(function(err, req, res, next) {
    res.status(err.statusCode).json({ msg: err.message })
})


const PORT = 3080
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => console.log(`Server listening on port:${PORT}`))
    }
    catch (error) {
        console.log(error)
    }
}

start()