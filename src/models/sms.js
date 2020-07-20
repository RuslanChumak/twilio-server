const mongoose = require('mongoose')

let smsSchema = new mongoose.Schema({
    sid:{
        type: String,
        required: true,
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})
const Sms = mongoose.model("Sms", smsSchema)

module.exports = Sms

