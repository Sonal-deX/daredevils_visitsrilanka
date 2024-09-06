const cors = require('cors');
const express = require('express');
const app = express();
const cron = require('node-cron');

const { processApplicants } = require('./controller/applicantController')

// Schedule the function to run every 30 minutes
// cron.schedule('*/1 * * * *', () => {
//     console.log('Running Interpol check for applicants under review...');
//     processApplicants();
// });

// request allows
app.use(express.json());

// error handling middleware import
const errorHandler = require('./errorHandler')

// accept requests from defined origin
app.use(cors());

// Routes
const routes = require('./routes/routes');

// Use routes
app.use('/', routes);

// Use error handler
app.use(errorHandler)

// sequalize
// app.js
const Admin = require('./model/admin')
const Applicant = require('./model/applicant')
const Sequelize = require('./sequelize');

(async () => {
    try {
        // Note: Remove `alter: true` when deploying to production
        await Sequelize.sync({ alter: false, logging: false });
        console.log('Models synced successfully.');
    } catch (error) {
        console.error('Error syncing models:', error);
    }
})();


// Server setup
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});