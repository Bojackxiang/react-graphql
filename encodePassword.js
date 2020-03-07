const bcrypt = require('bcrypt');
const saltRound = 10;

exports.encode = (password) =>{
    return bcrypt.hashSync(password, saltRound);
}

