const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, UnauthenticatedPassError } = require('../errors')

const register = async (req, res) => {
    // bad request errors
    const {name, email, password} = req.body
    if (!name || !email || !password){
        throw new BadRequestError('Please provide name, email and password')
    }

    // check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new BadRequestError('Email already exists')
    }

    // check if password have at least 6 characters
    if (password.length < 6) {
        throw new BadRequestError('Password must be at least 6 characters long')
    }
    
    // save user
    const user = await User.create({...req.body})
    // generate jwt
    const token = user.createJWT()
    // send json
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const {email, password} = req.body
    //bad request error
    if (!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    // authentication error
    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('User not authenticated.')
    }
    // incorrect password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedPassError('Incorrect password.')
    }

    // compare password
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })

}

module.exports = {
    register,
    login
}