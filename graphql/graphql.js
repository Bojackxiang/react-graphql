const { buildSchema } = require('graphql')
const inputType = require('./inputType')
const dataType = require('./dataType')

const buildSchemaQL = buildSchema(`
    ${dataType}

    ${inputType}

    type loginResponse{
        userId: ID
        token: String
        expire: Int
    }

    type RootQuery{
        events: [Event!]!
        users: [User!]!
        getBookings: [Booking]!
        userLogin(email: String!, password: String!): loginResponse!
    }

    type RootMutation{
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking
        createBooking(bookInput: BookingInput) : Booking
        cancelBooking(id: ID!) : loginResponse
    }
    
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);

module.exports = {
    buildSchemaQL
}
