const express = require('express')
const router = express.Router()

const {getAllContacts,getContactbyId,getContactbyName,createContact,updateContact,deleteContact} = require('../controllers/contacts')

const use = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next)

router.route('/').post(use(createContact)).get(use(getAllContacts))
router.route('/:id').get(use(getContactbyId)).delete(use(deleteContact)).patch(use(updateContact))
router.route('/:id/:name').get(use(getContactbyName))

module.exports = router