const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://user:12345@bd-lr-5dypf.gcp.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
})