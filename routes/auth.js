const express = require('express')
const router = express.Router()

const {login, register} = require('../controllers/auth')

const use = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next)

router.post('/register', use(register))
router.post('/login', use(login))

module.exports = router