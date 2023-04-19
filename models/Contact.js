const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please provide a name'],
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required:[true, 'Please provide a email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide phone number'],
        length: 9
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    }
},{ timestamps: true })

module.exports = mongoose.model('Contact', ContactSchema)