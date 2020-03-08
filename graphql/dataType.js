const dataType = `
    type Event {
        _id: ID!
        title: String!
        price: Float!
        date: String!
        description: String!
        creator: User
    }

    type User{
        _id: String!
        email: String!
        password: String!
        createdEvents: [Event!]!
    } 

    type Booking{
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }
`

module.exports = dataType;