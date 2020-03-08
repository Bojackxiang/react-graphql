const bcrypt = require('bcrypt');
const saltRound = 10;

exports.encode = (password) =>{
    return bcrypt.hashSync(password, saltRound);
}

exports.comparePassword = async (password, bcryptPassword) => {
    return await bcrypt.compare(password, bcryptPassword)
}

