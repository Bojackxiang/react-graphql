const express = require('express');
const bodyparser = require("body-parser");
const { encode } = require('./encodePassword')
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql')
const db = require('./db');
const EventModel = require('./models/event')
const UserModel = require("./models/user")

const app = express();

app.use(bodyparser.json())

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      price: Float!
      date: String!
      description: String!
    }

    input EventInput{
      title: String! 
      description: String!
      price: Float! 
    }

    type User{
      _id: String!
      email: String!
      password: String!
    } 

    input UserInput{
      email: String!
      password: String!
    }

    type RootQuery{
      events: [Event!]!
      users: [User!]!
    }

    type RootMutation{
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }
        
    schema{
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return EventModel
        .find({})
        .then(data => {
          return data;
        }).catch(err => { throw err });
    },

    createEvent: (args) => {
      const { title, description, price } = args.eventInput;
      const newEvent = new EventModel({
        title: title,
        description: description,
        price: price,
        date: new Date().toString(),
        creator: '5e637a8a12975c244eb9cfe7'
      })

      // => tricky place to return back to graphql (这个地方要注意，返回两次)
      return newEvent
        .save()
        .then((result) => {
          return UserModel.findById('5e637a8a12975c244eb9cfe7').then(user => user)
        })
        .then(user => {
          console.log('找到了user')
          console.log(user)
          user.createdEvents.push(newEvent)
          return user.save();
        })
        .then(() => {
          return newEvent;
        })
        .catch(e => { throw e });
    },

    users: () => {
      return UserModel.find({}).then(result => {
        console.log(result)
        return result
      })
        .catch(err => {
          throw err;
        })
    },

    createUser: (args) => { // => 注意这个args本身自己就是一个object
      const { email, password } = args.userInput;
      
      return UserModel.find({ email: email })
        .then(user => {
          
          console.log("🚩 开始检查重复的用户")
          if (user.length > 0) throw "duplicated error"
          return user
        })
        .then(() => {
          console.log("🚩 开始创建新的用户")
          const newUser = new UserModel({
            email: email,
            password: encode(password),
          })
          return newUser.save();
        })
        .catch(err => { throw err })
    }

  },
  graphiql: true, // => (allow graphql user interface at http://localhost:3000/graphql) 打开user interface
}))

db.dbConnection();


app.listen(3000, () => {
  console.log('server is running ✅')
})