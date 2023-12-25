const jwt = require('jsonwebtoken');
require('dotenv').config();
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "You are not authorized" })
    }
    const token = authHeader.split(" ")[1];
    // console.log(token);
    // console.log(authHeader);
    try {
        const { username, userid } = jwt.verify(token, process.env.JWT_KEY);
        req.user = { username, userid }
        next()
    } catch (error) {
        return res.status(403).json({ error: "You are not authorized" })
    }

}
module.exports = authMiddleware