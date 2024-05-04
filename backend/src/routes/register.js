const express = require('express');
const router = express.Router();
const path = require('path');

const registerController = require('../controllers/registerController');
const staticFilesPath = "/Users/ashwingnanasekar/Downloads/project_repos/Financial_Market_Analysis/frontend/src/components/register/register.html"
router.use(express.static(staticFilesPath));

// Built-in middleware to handle url encoded form data
router.use(express.urlencoded({ extended: false }));

// Define route handler for the register URL ('/register')
router.get('/register', (req, res) => {
    res.sendFile(path.join(staticFilesPath));
});

// Middleware to serve CSS files with correct MIME type
router.get('*.css', (req, res) => {
    res.sendFile(req.url, { header: { 'Content-Type': 'text/css' } });
});

// Middleware to serve image files
router.get('*.(jpg|png|gif|jpeg|svg)', (req, res) => {
    res.sendFile(req.url);
});

router.post('/', registerController.handleNewUser);

module.exports = router;