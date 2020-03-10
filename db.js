const mongoose = require('mongoose')


const dbConnection = () => {
    mongoose.connect('mongodb+srv://my-old-mac:911004@cluster0-ee8ps.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log('db is ready ✅') })
        .catch(() => {
            console.log('db has error ❌')
        });
}


module.exports = {
    dbConnection
}