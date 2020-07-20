const express = require('express')
const router = express.Router()
const client = require('../middleware/twilio')
const auth = require('../middleware/auth')
const Voice = require('../models/voice')
var twilio = require('twilio');
var VoiceResponse = twilio.twiml.VoiceResponse;

var ClientCapability = twilio.jwt.ClientCapability;

// GET /token/generate
router.post('/token/generate', function (req, res) {
  var page = req.body.page;
  var clientName = (page == "/dashboard"? "support_agent" : "customer");

  var capability = new ClientCapability({
      accountSid: "ACd2270faa6dcfb6da82f2c2840e6ad3b4",
      authToken: '89b5b5d1e2e6b36c2165bc6c6e8e4fe3'
  });
  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: 'APb3718ddc3e6a75f0d577c09a479da311'}));
  capability.addScope(
    new ClientCapability.IncomingClientScope(clientName));

  var token = capability.toJwt();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ token: token }));
});

// POST /calls/connect
router.post('/call/connect', twilio.webhook({validate: false}), function(req, res, next) {
	console.log(req.body.phoneNumber)
 var phoneNumber = "+380683341926";
  if(req.body.phoneNumber)
	  phoneNumber = req.body.phoneNumber
  var callerId = '+16787838422';
  var twiml = new VoiceResponse();

  var dial = twiml.dial({callerId : callerId});
  if (phoneNumber != null) {
    dial.number(phoneNumber);
  } else {
    dial.client("support_agent");
  }

  res.send(twiml.toString());
});

router.get('/', (req, res)=>{
    res.send('home');
})
router.post('/twilio/voice',  auth,async(req,res) =>{

    try{
        client.calls
        .create({
            twiml: `<Response><Say>${req.body.text}</Say><Play>https://demo.twilio.com/docs/classic.mp3</Play></Response>`,
            to: req.body.to,
            from: '+16787838422'
       })
      .then(call => {
        let voice = new Voice({
            sid: call.sid,
            userId: req.user.id
          })
          voice.save()
          res.send(call.sid)
        });
    }catch(e){
        res.send(e.message)
    }
    
})
router.get('/twilio/voice', auth, async(req,res) =>{

    try{
        client.calls.list({limit: 1000})
            .then(calls => res.send(calls));
    }catch(e){
        res.send(e.message)
    }
    
})
module.exports = router