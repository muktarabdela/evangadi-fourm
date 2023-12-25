const dbConnection = require('../db/dbconfig');

// Function to create a new answer
const newAnswer = async (req, res) => {
    const { answer } = req.body
    const { userid } = req.user;
    const { questionid } = req.params;

    if (!req.body.answer) {
        return res.status(400).json({ error: 'provide answer field' });
    }
    // generate a random number for the answerid
    const answerid = Math.floor(Math.random() * 1000000000);

    try {
        await dbConnection.query("INSERT INTO answers (answer, userid, questionid, answerid) VALUES (?,?,?,?)", [answer, userid, questionid, answerid])
        // Return a 201 created response if the question is successfully inserted
        return res.status(201).json({ message: 'answer submitted', answerid });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
}

const getAnswer = async (req, res) => {
    const { answerid } = req.params;
    if (!answerid) {
        return res.status(400).json({ error: 'Missing answerid parameter' });
    }
    try {
        const [allAnswer] = await dbConnection.query("SELECT * FROM answers WHERE answerid = ?", [answerid]);
        if (!allAnswer.length) {
            return res.status(404).json({ error: 'answer not found' });
        }

        return res.status(200).json({ allAnswer });

    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ msg: "something went to wrong try again later" });
    }
}


const allAnswer = async (req, res) => {
    const { questionid } = req.params;

    try {
        const query = 'SELECT * FROM answers WHERE questionid = ?';
        const [answers] = await dbConnection.query(query, [questionid]);

        if (answers.length > 0) {
            res.status(200).json(answers);
        } else {
            res.status(404).json({ error: 'No answers found for the provided questionid' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
};

module.exports = { allAnswer };


module.exports = { newAnswer, getAnswer, allAnswer }