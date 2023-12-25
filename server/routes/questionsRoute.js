const express = require('express');
const router = express.Router();

// Import the functions from the questionController module
const { allQuestions, newQuestion, oneQuestion } = require('../controller/questionCotroller');

// Import the authMiddleware for authentication and authorization
const authMiddleware = require('../middleware/authMiddleware');

// Route for creating a new question. 
router.post('/new-question', newQuestion);

// Route for retrieving all questions.
router.get('/all-questions', allQuestions);

router.get('/one-question/:questionid', oneQuestion);

// Export the router to make it available for use in your Express application.
module.exports = router;
