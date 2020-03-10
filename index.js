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
const cors = require('cors')

app.use(cors({origin:true,credentials: true}));


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

app.listen(8080, () => {
    console.log('server is running ✅')
})