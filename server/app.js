const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
// db connection
const dbConnection = require('./db/dbconfig');

// Enable CORS
app.use(cors());

//  authtentication middleware
const authMiddleware = require('./middleware/authMiddleware');

// Parse JSON request bodies
app.use(express.json());

// user routes and middleware 
const userRoutes = require('./routes/userRoutes');
app.use("/api/users", userRoutes);

// Questions routes and middleware 
const questionRotes = require('./routes/questionsRoute');
app.use("/api/question", authMiddleware, questionRotes)

// answer routes and middleware 
const answerRoute = require('./routes/answerRoute');
app.use("/api/answer", authMiddleware, answerRoute)



async function start() {
    try {
        const result = await dbConnection.execute(" select 'test' ",)
        app.listen(PORT);
        console.log(`Server listening on port ${PORT}`);
    } catch (error) {
        console.log(error.message);
    }
}
start()

const PORT = process.env.PORT;
