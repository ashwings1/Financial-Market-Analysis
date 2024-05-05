const User = require('../models/User');
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    console.log("Received new user request:", req.body);
    const { firstName, lastName, username, password } = req.body;
    if (!firstName || !lastName || !username || !password) return res.status(400).json({ message: "First Name, Last Name, Username and Password are required" });
    console.log("Initial check passed. Checking for duplicate username...");

    //Duplicate username in database
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) {
        console.log("Duplicate username found. Aborting registration.");
        return res.sendStatus(409);
    }

    try {
        //encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("after encryption")

        //Create and store new user
        const result = await User.create({
            "firstName": firstName,
            "lastName": lastName,
            "username": username,
            "password": hashedPassword
        });

        console.log("User created successfully:", result);

        //res.status(201).json({ 'success': `New user ${username} created!` });
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error occurred during user creation:", error);
        res.status(500).json({ 'message': error.message })
    }
};

module.exports = { handleNewUser };