const EventModel = require('../models/event')
const UserModel = require('../models/user')
const BookingModel = require('../models/booking')
const { encode, comparePassword } = require('../encodePassword')
const jwt = require('jsonwebtoken')


const getEvent = () => {
    return EventModel
        .find({})
        .populate('creator') // => 通过mongoose 的populate来寻找关联的数据库
        .then(data => {
            return data
        }).catch(err => { throw err });
}

const createEvent = (args, req) => {
    console.log('isAuth', req.auth)
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
            user.createdEvents.push(newEvent)
            return user.save();
        })
        .then(() => {
            return newEvent;
        })
        .catch(e => { throw e });
}

const getUser = () => {
    return UserModel.find({})
        .populate('createdEvents')
        .then(result => {
            console.log(result)
            return result
        })
        .catch(err => {
            throw err;
        })
}

const createUser = (args) => {
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

const getBookings = async () => {
    console.log('getBooking ')
    try {
        // const {id} = args.id;
        const bookings = await BookingModel.find()
        console.log(bookings)
        return bookings;
    } catch (error) {
        throw error
    }


}

const createBooking = async (args) => {
    console.log('🟢 start creating booking ')
    const { eventId, userId } = args.bookInput;
    const event = await EventModel.findById(eventId);
    const user = await UserModel.findById(userId);
    // => 这边需要注意，如果id的长度没有达到mongoose的要求，那么直接就会报错Z

    if (!event || !user) throw "No such a event or user";

    const newBooking = new BookingModel({
        event: eventId,
        user: userId
    })

    try {
        return await newBooking.save();
    } catch (error) {
        throw error;
    }
}

const cancelBooking = async (args) => {
    try {
        const deleteResult = await BookingModel.deleteOne({ _id: args.id })
        console.log(deleteResult)
        if (deleteResult.deletedCount > 0) return true
        return false
    } catch (error) {
        throw error
    }


}

/**
 * please note here
 * since the comparePassword's bycrypt is a promist, 
 * although we solve it with a async and await, but when it returned, its still a promise
 * (
 '* !! 这边是一个小重点
 * 因为compare是一个promise， 就算是await 了之后，return到外面，如果不使用await，
 * 他还是一个promise
 * )
 */
const userLogin = async (args) => {
    try {
        const { email, password } = args;
        const user = await UserModel.findOne({ email: email })
        const bcryptResult = await comparePassword(password, user.password)
        
        if (!bcryptResult) throw new Error("not right user infomation ...")

        return {
            userId: user.id,
            token: jwt.sign(
                { userId: user._id, email: user.email, },
                'somesupersecretey',
                { expiresIn: '1d' }),
            expire: 1,
        }
    } catch (e) {
        throw e
    }
}

module.exports = {
    getEvent,
    createEvent,
    getUser,
    createUser,
    getBookings,
    createBooking,
    cancelBooking,
    userLogin
}
