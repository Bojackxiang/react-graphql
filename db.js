const mongoose = require('mongoose')


const dbConnection = () => {
    mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log('db is ready ✅') })
        .catch(() => {
            console.log('db has error ❌')
        });
}


module.exports = {
    dbConnection
}