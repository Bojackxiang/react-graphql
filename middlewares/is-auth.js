const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    console.log('is auth middleware activated ...')

    const authHeader = req.get('Authentication')
    if(!authHeader)  {
        req.auth = false
        return next();
    }

    const token = authHeader.split(" ")[1];
    if(!token || token == ' '){
        req.auth = false
        return next()
    }

    try {
        decodeToken = jwt.verify(token, 'somesupersecretey')
        req.auth = true
        req.userId = decodeToken.userId;
    } catch (error) {
        req.auth = false
    }

    return next();
    
}

/**
 * please note : if not return next() the code will not break 
 * (
 * 如果只是next(), 会继续执行，但是该middle不会中断
 * )
 */






