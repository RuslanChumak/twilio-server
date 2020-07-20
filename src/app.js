const express = require('express')
const jsonParser = express.json()
require('./db/mongoose')
const cors = require('cors')
var path = require('path');
const userRouter = require('./routers/user')
const smsRouter = require('./routers/sms')
const voiceRouter = require('./routers/voice')

const PORT = process.env.PORT || 8080

const app = express()


const middleware = [
    cors(),
    jsonParser,
    userRouter,
    smsRouter,
    voiceRouter
]

app.use(middleware)


app.listen(PORT, ()=>{
    console.log('Добро пожаловать на рисовые поля')
})


