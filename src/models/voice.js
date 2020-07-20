const mongoose = require('mongoose')

let voiceSchema = new mongoose.Schema({
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


const Voice = mongoose.model("Voice", voiceSchema)

module.exports = Voice

