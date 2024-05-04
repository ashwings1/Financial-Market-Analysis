const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log("username", username);
    console.log("password", password);
    if (!username || !password) return res.status(400).json({ message: "Username and Password are required" });

    const foundUser = await User.findOne({ username: username }).exec()
    if (!foundUser) return res.sendStatus(401);
    //Evaluate password
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (passwordMatch) {
        console.log(`User [${username}] logged in successfully`);
        res.redirect('/dashboard');
    } else {
        res.sendStatus(401);
    }

}

module.exports = { handleLogin };