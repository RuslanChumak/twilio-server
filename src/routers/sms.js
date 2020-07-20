const express = require('express')
const router = express.Router()
const Sms = require('../models/sms')
const client = require('../middleware/twilio')
const auth = require('../middleware/auth')

router.post('/twilio/sms', auth, async(req,res) =>{
    try{
        let body = {
            body: req.body.text,
            from: '+16787838422',
            to: req.body.to
        }
        if(req.body.media)
            body.mediaUrl = [req.body.media]
        client.messages.create(body)
        .then(message => {
            let sms = new Sms({
                sid: message.sid,
                userId: req.user.id
            })
            sms.save()
            res.send(message.sid)
        })
    }catch(e){
        res.send(e.message)
    }
    
})
router.get('/twilio/sms/:id', auth, async(req,res) =>{

    try{
        client.messages(req.params.id)
        .fetch()
        .then(message => res.send(message));
    }catch(e){
        res.send(e.message)
    }
    
})

router.get('/twilio/allsms', auth, async(req,res) =>{
    
    try{
        let sms = await Sms.find({'userId': req.user.id})
        res.send(sms)
    }catch(e){
        res.send(e.message)
    }
    
})

router.delete('/twilio/sms', auth, async(req,res) =>{

    try{
        let sms = await Sms.find({'sid': req.body.sid}).remove()
        client.messages(req.body.sid).remove()
        res.send(sms)
    }catch(e){
        res.send(e.message)
    }
    
})

module.exports = router
