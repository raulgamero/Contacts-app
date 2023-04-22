const Contact = require('../models/Contact')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, UnauthenticatedPassError } = require('../errors')

const getAllContacts = async (req, res) => {
  const contacts = await Contact.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ contacts, count: contacts.length })
}

const getContactbyId = async (req, res) => {
  const {
    user: { userId },
    params: { id: contactId },
  } = req

  const contact = await Contact.findOne({
    _id: contactId,
    createdBy: userId,
  })

  // check contact exits
  if (!contact) {
    throw new NotFoundError(`No contact with id ${contactId}`)
  }
  res.status(StatusCodes.OK).json({ contact })
}

const getContactbyName = async (req, res) => {
  const {
    params: { name: name },
    user: { userId }
  } = req

  // bad request error
  if (name === '') {
    throw new BadRequestError('Name or phone or email fields cannot be empty')
  }

  // check contact exits with name
  const contacts = await Contact.find({ createdBy: userId, name: name }).sort('createdAt');
  if (!contacts) {
    throw new NotFoundError(`No contact with name ${name}`)
  }

  res.status(StatusCodes.OK).json({ contacts, count: contacts.length })
}

const createContact = async (req, res) => {
  // bad request error
  const {name, email, phone} = req.body
  if (!name || !email || !phone){
      throw new BadRequestError('Please provide name, email and phone')
  }

  req.body.createdBy = req.user.userId
  const contact = await Contact.create(req.body)
  res.status(StatusCodes.CREATED).json({ contact })
}

const updateContact = async (req, res) => {
  const {
    body: { name, phone, email },
    user: { userId },
    params: { id: contactId },
  } = req

  // bad request error
  if (name === '' || phone === '' || email === '') {
    throw new BadRequestError('Name or phone or email fields cannot be empty')
  }
  
  const contact = await Contact.findByIdAndUpdate(
    { _id: contactId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  // check contact exits
  if (!contact) {
    throw new NotFoundError(`No contact with id ${contactId}`)
  }
  res.status(StatusCodes.OK).json({ contact })
}

const deleteContact = async (req, res) => {
  const {
      user: { userId },
      params: { id: contacId },
    } = req
  
    const contact = await Contact.findByIdAndRemove({
      _id: contacId,
      createdBy: userId,
    })

    // check contact exits
    if (!contact) {
      throw new NotFoundError(`No contact with id ${contacId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllContacts,
  getContactbyId,
  getContactbyName,
  createContact,
  updateContact,
  deleteContact
}