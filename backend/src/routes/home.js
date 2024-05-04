const express = require("express");
const router = express.Router();
const path = require("path");
const staticFilesPath = "/Users/ashwingnanasekar/Downloads/project_repos/Financial_Market_Analysis/frontend/src/components/home/home.html"
router.use(express.static(staticFilesPath));

// Define route handler for the root URL ('/')
router.get('/', (req, res) => {
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


module.exports = router;