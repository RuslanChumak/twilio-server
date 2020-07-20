const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})
router.post('/users/logoutAll',auth, async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('Logout All')
    } catch(e){
        res.send(e.message)
    }
})
router.post('/users/logout',auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send("Logout")
    }catch(e){
        res.status(500).send(e.message)
    }
})
router.get("/users",auth, async (req, res) =>{
    try{
        let users = await User.find()
        res.send(users)
    }
    catch(err){
        res.send(err.message)
    }
    
})
router.get("/users/:id",auth,(req, res) =>{
    const id = req.params.id
    User.findById(id).then((user)=>{
        res.status(200).send(user)
    }).catch((errors)=>{
        res.status(500).send(errors.message)
    })
})
router.post("/users", async(req, res) =>{

    let user = new User(
        {
            name: req.body.name, 
            age: req.body.age, 
            email: req.body.email,
            password: req.body.password
        })
        try{
            await user.save()
            const token = await user.generateAuthToken()
            res.send({user, token})
        }catch(e){
            res.send(e.message)
        }
})
router.delete('/users/me',auth,async(req, res) =>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.send(e.message)
    }

})
router.put('/users/me',auth,async(req, res) =>{
  try{
    const updates = ['name', 'email', 'password', 'age']
    updates.forEach((update)=> req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  }catch(err){
        res.send(err.message)
    }
    
})
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findOneByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch(e){
        res.send(e.message)
    }
})

module.exports = router