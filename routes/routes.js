const express = require('express');
const router = express.Router();

// for image handling
const multer = require('multer');
const AWS = require('aws-sdk');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// JWT Middleware import
const { verifyToken } = require('../JWT/jwtConfigue');

// import validators
const { createApplicant } = require('../validation/applicantValidation');
const { createAdminValidator, adminLoginValidator } = require('../validation/adminValidation');

// imporation validation handler
const validate = require('../validationHandler');

// Import controllers
const applicantController = require('../controller/applicantController');
const adminController = require('../controller/adminController');
const { chatGptAsk } = require('../chatgpt');

// create applicant route
router.post('/applicant', upload.fields([{ name: 'passImage' }, { name: 'passBio' }]), applicantController.createApplicant)
router.get('/applicant', applicantController.getApplicant)
router.put('/applicant', verifyToken, applicantController.updateApplicantApproveStatus)

// admin routes
router.post('/admin', validate(createAdminValidator, ['body']), adminController.createAdmin)
router.post('/login', validate(adminLoginValidator, ['body']), adminController.adminLogin)

// chatgpt
router.post('/question', chatGptAsk)


// export routes
module.exports = router;