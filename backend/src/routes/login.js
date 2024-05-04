const express = require("express");
const router = express.Router();
const path = require("path");

const loginController = require('../controllers/loginController');
const staticFilesPath = "/Users/ashwingnanasekar/Downloads/project_repos/Financial_Market_Analysis/frontend/src/components/login/login.html"
router.use(express.static(staticFilesPath));

// Define route handler for the root URL ('/')
router.get('/login', (req, res) => {
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

router.post('/', loginController.handleLogin);


module.exports = router;