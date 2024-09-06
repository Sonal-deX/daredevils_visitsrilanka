const Applicant = require('../model/applicant');
const { updateApplicantApproveStatusMail, createApplicantMail } = require('../emailHandler');
const axios = require('axios');
const AWS = require('aws-sdk'); // Add this line

// Replace these values with your own
const spaceName = 'zenko';
const region = 'syd1'; // e.g., 'nyc3'
const accessKeyId = 'DO00A9FB3R4EWXPD9V6Y';
const secretAccessKey = 'B/wOMSAS9sL/OpsBzPuj9evAqC9khchfvv3FGtVRX2c';

// DigitalOcean Spaces configuration
const spacesEndpoint = new AWS.Endpoint(`${region}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});

// create applicant
exports.createApplicant = async (req, res, next) => {

    var {
        honorific,
        name,
        address,
        dateOfBirth,
        phone,
        email,
        passNo,
        passCountry,
        dateOfExpiry,
        dateOfIssue,
        visaType,
        duration,
        visaPeriod,
        entryType,
        previouslyVisited,
        extendAssitance,
        docsReady,
        TandCAgree
    } = req.body;

    const passImageFile = req.files['passImage'][0];
    const passBioFile = req.files['passBio'][0];

    try {

        // Create a specific folder path for this applicant
        const folderPath = `applicants/${name}_${Date.now()}/`;

        // Upload both images to DigitalOcean Spaces
        const passImageParams = {
            Bucket: spaceName, // Replace with your bucket name
            Key: `${folderPath}${passImageFile.originalname}`,
            Body: passImageFile.buffer,
            ACL: 'public-read',
        };
        const passBioParams = {
            Bucket: spaceName,
            Key: `${folderPath}${passBioFile.originalname}`,
            Body: passBioFile.buffer,
            ACL: 'public-read',
        };

        const [passImageUploadResult, passBioUploadResult] = await Promise.all([
            s3.upload(passImageParams).promise(),
            s3.upload(passBioParams).promise(),
        ]);

        const passImageUrl = passImageUploadResult.Location;
        const passBioUrl = passBioUploadResult.Location;

        const newApplicant = await Applicant.create({
            honorifics: honorific,
            name: name,
            address: address,
            dateOfBirth: dateOfBirth,
            phoneNo: phone,
            email: email,
            passNo: passNo,
            passCountry: passCountry,
            dateOfExpiry: dateOfExpiry,
            dateOfIssue: dateOfIssue,
            passImage: passImageUrl,
            visaType: visaType,
            duration: duration,
            visaPeriod: visaPeriod,
            entryType: entryType,
            previouslyVisited: previouslyVisited,
            extendAssistance: extendAssitance,
            docReady: docsReady,
            TandCAgree: TandCAgree,
            passBio: passBioUrl,
            interPolCheck: 'under review',
            adminApproveStatus: 'under review',
            submitEmailSentStatus: null,
            approveEmailSentStatus: null

        });
        console.log(newApplicant);
        createApplicantMail(newApplicant)
        // res.json(newApplicant)
        // createApplicantMail(newApplicant);
    } catch (error) {
        console.log(error);
        next(error)
    }

};

// update applicant
exports.updateApplicantApproveStatus = async (req, res, next) => {
    var {
        adminApproveStatus,
        applicantId
    } = req.body;

    try {
        var applicant = await Applicant.findOne({
            where: {
                applicantId: applicantId
            }
        })

        if (!applicant) {
            var error = new Error('Applicant for applicantid not found')
            error.status = 404
            next(error)
        } else {
            const updateStatus = await applicant.update({
                adminApproveStatus: adminApproveStatus
            });
            updateApplicantApproveStatusMail(updateStatus);
        }
    } catch (error) {
        next(error)
    }
}

// Function to check both Red and Yellow Notices using the provided parameters
// async function checkRiskyStatus(applicant) {
//     const {
//         forename, name, nationality, ageMax, ageMin, freeText, sexId, arrestWarrantCountryId, page = 1, resultPerPage = 160
//     } = applicant;

//     // Base API URLs for Red and Yellow Notices
//     const redNoticeApiUrl = `https://ws-public.interpol.int/notices/v1/red?forename=${forename}&name=${name}&nationality=${nationality}&ageMax=${ageMax}&ageMin=${ageMin}&freeText=${freeText}&sexId=${sexId}&arrestWarrantCountryId=${arrestWarrantCountryId}&page=${page}&resultPerPage=${resultPerPage}`;
//     const yellowNoticeApiUrl = `https://ws-public.interpol.int/notices/v1/yellow?forename=${forename}&name=${name}&nationality=${nationality}&ageMax=${ageMax}&ageMin=${ageMin}&freeText=${freeText}&sexId=${sexId}&arrestWarrantCountryId=${arrestWarrantCountryId}&page=${page}&resultPerPage=${resultPerPage}`;

//     try {
//         // Check Red Notice
//         let response = await axios.get(redNoticeApiUrl);
//         let redNoticeData = response.data;

//         if (redNoticeData._embedded && redNoticeData._embedded.notices.length > 0) {
//             // If the applicant is found in Red Notice, mark as risky
//             console.log(`Applicant ${applicant.name} is risky (Red Notice).`);
//             return {
//                 risky: true,
//                 source: 'Red Notice',
//                 data: redNoticeData._embedded.notices
//             };
//         } else {
//             // If Red Notice is clear, check Yellow Notice
//             response = await axios.get(yellowNoticeApiUrl);
//             let yellowNoticeData = response.data;

//             if (yellowNoticeData._embedded && yellowNoticeData._embedded.notices.length > 0) {
//                 // If the applicant is found in Yellow Notice, mark as risky
//                 console.log(`Applicant ${applicant.name} is risky (Yellow Notice).`);
//                 return {
//                     risky: true,
//                     source: 'Yellow Notice',
//                     data: yellowNoticeData._embedded.notices
//                 };
//             } else {
//                 // If both Red and Yellow Notices are clear, mark as good
//                 console.log(`Applicant ${applicant.name} is clear (No Red or Yellow Notice).`);
//                 return { risky: false };
//             }
//         }
//     } catch (error) {
//         console.error(`Error checking notices for applicant ${applicant.name}:`, error);
//         throw error;
//     }
// }

// // Function to get all applicants with "under review" status and check them
// exports.processApplicants = async function () {
//     try {
//         const applicants = await Applicant.findAll({ where: { interPolCheck: 'under review' } });

//         // Loop through each applicant and run the checkRiskyStatus function
//         for (const applicant of applicants) {
//             const checkResult = await checkRiskyStatus(applicant);

//             // Update the applicant's record based on the result of the checks
//             if (checkResult.risky) {
//                 await Applicant.update(
//                     { interPolCheck: `risky (${checkResult.source})` },
//                     { where: { applicantId: applicant.applicantId } }
//                 );
//             } else {
//                 await Applicant.update(
//                     { interPolCheck: 'good' },
//                     { where: { applicantId: applicant.applicantId } }
//                 );
//             }
//         }
//     } catch (error) {
//         console.error('Error processing applicants:', error);
//     }
// };

// get applicant
exports.getApplicant = async (req, res, next) => {


    try {
        const newApplicant = await Applicant.findAll()
        res.json(newApplicant)
        // createApplicantMail(newApplicant);
    } catch (error) {
        console.log(error);
        next(error)
    }

};
