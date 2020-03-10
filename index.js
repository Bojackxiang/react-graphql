const express = require('express');
const bodyparser = require("body-parser");
const graphqlHTTP = require('express-graphql');
const isAuth = require('./middlewares/is-auth')
const {
    getEvent,
    createEvent,
    getUser,
    createUser,
    getBookings,
    createBooking,
    cancelBooking,
    userLogin
} = require('./graphql/rootEvents');
const db = require('./db');
const gqlSchema = require('./graphql/graphql')
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Methods', "POST,GET,OPTION")
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authentication")
})

app.use(bodyparser.json())

app.use(isAuth)

app.use('/graphql', graphqlHTTP({
    schema: gqlSchema.buildSchemaQL,
    rootValue: {
        events: getEvent,
        createEvent: createEvent,
        users: getUser,
        createUser: createUser,
        getBookings: getBookings,
        createBooking: createBooking,
        cancelBooking: cancelBooking,
        userLogin: userLogin
    },
    graphiql: true, // => (allow graphql user interface at http://localhost:3000/graphql) 打开user interface
}))

db.dbConnection();

app.listen(3005, () => {
    console.log('server is running ✅')
})