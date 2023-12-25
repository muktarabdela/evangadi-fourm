// Import required modules
const dbConnection = require('../db/dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
// Set up multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination directory where files will be saved
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Set the filename for the uploaded file (you can customize this as needed)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const register = async (req, res) => {
    // Destructure request body and extract user information
    const { username, firstname, lastname, email, password, bio } = req.body;

    // Check if request body or required fields are missing
    if (!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Missing or incomplete data in the request body.' });
    }

    // Check if a user with the same username or email already exists in the database
    const [existingUser] = await dbConnection.query("SELECT username, userid from users WHERE username = ? or email = ?", [username, email]);

    if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Username or email already exists' });
    } else if (password.length <= 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // Hash the user's password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Handle the profile picture file upload
        upload.single('profile_picture')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred (e.g., file too large)
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                // An unexpected error occurred
                return res.status(500).json({ error: 'Something went wrong, please try again' });
            }

            // Get the path to the uploaded file
            const profile_picturePath = req.file ? req.file.path : null;

            const result = await dbConnection.query("INSERT INTO users(username, firstname, lastname, email, password, bio, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)", [username, firstname, lastname, email, hashedPassword, bio, profile_picturePath]);
            const payload = { username, email, userid: result.insertId };
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "5d" });
            return res.status(201).json({ message: 'User registered', token });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
}



// Function for user login
const login = async (req, res) => {
    // Check if request body or required fields are missing
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Please enter all required fields' });
    }

    // Destructure request body and extract user login information
    const { email, password } = req.body;

    try {
        // Query the database to retrieve the user with the provided email
        const [user] = await dbConnection.query("SELECT userid, username, email, password FROM users WHERE email = ?", [email])

        if (user.length === 0) {
            return res.status(400).json({ error: 'User does not exist' })
        }

        // Verify the provided password against the stored hashed password
        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' })
        }

        // Create a JSON Web Token (JWT) for the user's authentication
        const username = user[0].username;
        const userid = user[0].userid;
        const token = jwt.sign({ username, userid }, process.env.JWT_KEY, { expiresIn: "5d" })

        // Return a 200 OK response with a success message and the JWT
        return res.status(200).json({ message: 'Login successful', token })

    } catch (error) {
        // Log and return a 500 internal server error response if an error occurs
        console.log(error.message);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
}

// logout function

const logout = async (req, res) => {
    try {
        // Remove the JWT from the request header
        req.headers.authorization = null;
        // Return a 200 OK response with a success message
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Log and return a 500 internal server error response if an error occurs
        console.log(error.message);
        res.status(500).json({ error: 'Something went wrong, please try again' });
    }
}

// Function to check the user's authentication
const checkUser = async (req, res) => {
    const username = req.user.username;
    const userid = req.user.userid;
    res.status(200).json({ user: "valid user", username, userid });
}
// Export the functions for use in other parts of the application
module.exports = { register, login, checkUser, logout }
