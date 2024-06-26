const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

const staticFilesPath = "/Users/ashwingnanasekar/Downloads/project_repos/Financial_Market_Analysis/src/frontend/src/components/dashboard/dashboard.html"
router.use(express.static(staticFilesPath));


/*
// Function to convert predictions to chart data
function convertChart(predictions) {
    // Process predictions and convert to chart data format
    const labels = predictions.map(predictions => predictions.date);
    const values = predictions.map(predictions => predictions.price);
    return { labels, values };
}
*/

/*
// Define route handler for the root URL ('/')
router.get('/dashboard', async (req, res) => {
    //res.sendFile(path.join(staticFilesPath));
    try {
        // Make request to Azure AutoML
        const predictionsResponse = await axios.get('https://stockprediction-ash.eastus.inference.ml.azure.com/score');
        const predictions = predictionsResponse.data;
        const chartData = convertChart(predictions);
        res.render('dashboard', { chartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve predicitons' });
    }
});
*/

router.get('/dashboard', (req, res) => {
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


//router.post('/', loginController.handleLogin);

module.exports = router;