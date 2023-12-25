const express = require('express');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const { register, login, checkUser, logout } = require('../controller/userCotroller')

// register route
router.post('/register', register)
// login route
router.post('/login', login)
// check route
router.get('/check', authMiddleware, checkUser)

router.delete('/logout', authMiddleware, logout);


module.exports = router;
