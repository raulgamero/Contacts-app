const CustomAPIError = require('./custom-api')
const UnauthenticatedError = require('./unauthenticated')
const UnauthenticatedPassError = require('./unauthenticated-pass')
const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  UnauthenticatedPassError,
  NotFoundError,
  BadRequestError,
}