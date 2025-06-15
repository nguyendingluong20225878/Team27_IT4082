const jwt = require('jsonwebtoken')

const genAccessToken = (id, role, fullname, email) => jwt.sign(
    { id, role, fullname, email },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h'
    }
)

const genRefreshToken = (id) => jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
)

module.exports = {
    genAccessToken,
    genRefreshToken
}