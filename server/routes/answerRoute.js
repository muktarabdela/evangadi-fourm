const express = require('express');
const router = express.Router();

const { newAnswer, getAnswer, allAnswer } = require('../controller/answerController');

router.get('/get-answer/:answerid', getAnswer);

router.post('/new-answer/:questionid', newAnswer);

router.get('/all-answer/:questionid', allAnswer);



module.exports = router;