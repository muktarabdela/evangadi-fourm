// Import the database connection module
dbConnection = require('../db/dbconfig');

// Function to create a new question
const newQuestion = async (req, res) => {
    const { title, description, tag } = req.body;

    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ error: 'Missing or incomplete data in the request body.' });
    }

    const { userid } = req.user;

    // Generate a unique questionid using a combination of timestamp and a random number
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    const questionid = `${timestamp}-${randomId}`;

    try {
        // Check if a question with the same title and description already exists in the database
        await dbConnection.query("SELECT title, description FROM questions WHERE title = ? AND description = ?", [title, description]);

        // Insert the new question into the database with the generated questionid, title, description, userid these are come from questions table tags are come from tags table
        await dbConnection.query("INSERT INTO questions (questionid, title, description, userid,tag) VALUES (?, ?, ?, ?,?)", [questionid, title, description, userid, tag]);



        // Return a 201 created response if the question is successfully inserted
        return res.status(201).json({ message: 'Question submitted', questionid });
    } catch (error) {
        // Log and return a 500 internal server error response if an error occurs
        console.log(error.message);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
}

// Function to get all questions
const allQuestions = async (req, res) => {
    try {
        // Query the database to select all questions
        const [questions] = await dbConnection.query("SELECT * FROM questions");
        // This code is incorrect and should be removed:
        // const id = questions[0].id

        // Check if no questions were found
        if (questions.length < 1) {
            return res.status(404).json({ error: 'No questions found' });
        }

        // Return a 200 OK response with the list of questions
        return res.status(200).json({ questions });
    } catch (error) {
        // Log and return a 500 internal server error response if an error occurs
        console.log(error.message);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
}

// Function to get one question

const oneQuestion = async (req, res) => {
    // Destructure the questionid from the request parameters
    const { questionid } = req.params;

    try {
        // Query the database to select the question with the specified questionid
        const [question] = await dbConnection.query("SELECT * FROM questions WHERE questionid = ?", [questionid]);

        // Check if no question was found
        if (question.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Return a 200 OK response with the question
        res.status(200).json({ question: question[0] }); // Assuming you return a single question
    } catch (error) {
        // Log the error
        console.error(error);

        // Return a 500 internal server error response with an error message
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
};


// Export the functions so they can be used in other parts of the application
module.exports = { newQuestion, allQuestions, oneQuestion };
