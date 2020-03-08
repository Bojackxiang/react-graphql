const inputType  = `
    input EventInput{
        title: String! 
        description: String!
        price: Float! 
    }

    input UserInput{
        email: String!
        password: String!
    }

    input BookingInput {
        eventId: ID!
        userId: ID!
    }

    

`;

module.exports = inputType;