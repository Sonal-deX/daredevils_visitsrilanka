const nodemailer = require('nodemailer');
const Applicant = require('./model/applicant');

// Create a transporter with Gmail configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'visitsrilankadaredevils@gmail.com', // your Gmail email address
        pass: 'ytfh dlvl jryx jitx'// your Gmail email password
    }
});

// approve update status mail sent
exports.updateApplicantApproveStatusMail = async (applicant) => {

    const mailOptions = {
        from: 'visitsrilankadaredevils@gmail.com', // Sender email address
        to: `${applicant.dataValues.email}`,
        subject: `Visa - status`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VisitSriLanka - Application Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 600px;
                    margin: 0 auto;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #0044cc;
                    color: #ffffff;
                    padding: 15px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .content p {
                    font-size: 16px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #999999;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h2>Welcome to VisitSriLanka</h2>
                </div>
                <div class="content">
                    <p>Dear Applicant,</p>
                    <p>Thank you for submitting your visa application through VisitSriLanka. Below are the details of your submission:</p>
                    <p><strong>Passport ID:</strong> ${applicant.dataValues.passportID}</p>
                    <p><strong>Applicant ID:</strong> ${applicant.dataValues.applicantId}</p>
                    <p>We will process your application as soon as possible. You will receive updates on the status of your visa application via email.</p>
                    <p>If you have any questions, please do not hesitate to contact our support team.</p>
                    <p>Best regards,<br>The VisitSriLanka Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 VisitSriLanka. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`
    };

    try {
        const email = await transporter.sendMail(mailOptions);
        if (email.accepted.length != 0) {
            await Applicant.update(
                { approveEmailSentStatus: 1 },
                {
                    where: {
                        applicantId: applicant.dataValues.applicantId
                    }
                }
            )
        }

        res.status(201).json({ msg: "success" });
    } catch (error) {
        console.log(error);
    }
}

// create applicant mail sent
exports.createApplicantMail = async (applicant) => {

    const mailOptions = {
        from: 'visitsrilankadaredevils@gmail.com', // Sender email address
        to: `${applicant.dataValues.email}`,
        subject: `Visa - status`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VisitSriLanka - Visa Status Update</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 600px;
                    margin: 0 auto;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #0044cc;
                    color: #ffffff;
                    padding: 15px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .content p {
                    font-size: 16px;
                    color: #333333;
                }
                .status {
                    font-size: 18px;
                    font-weight: bold;
                    color: #008000; /* Green for approved */
                }
                .status.denied {
                    color: #FF0000; /* Red for denied */
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #999999;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h2>VisitSriLanka - Visa Status Update</h2>
                </div>
                <div class="content">
                    <p>Dear Applicant,</p>
                    <p>We are pleased to inform you of the status of your visa application. Please find the details below:</p>
                    <p><strong>Passport ID:</strong> ${applicant.dataValues.passNo}</p>
                    <p><strong>Applicant ID:</strong> ${applicant.dataValues.applicantId}</p>
                    <p><strong>Visa Status:</strong> <span class="status ${applicant.dataValues.interPolCheck}">${applicant.dataValues.adminApproveStatus}</span></p>
                    <p>If your visa is approved, please ensure that you follow the necessary guidelines for your travel to Sri Lanka.</p>
                    <p>If your visa is denied, you may contact our support team for further clarification.</p>
                    <p>Best regards,<br>The VisitSriLanka Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 VisitSriLanka. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`
    };

    try {
        const email = await transporter.sendMail(mailOptions);
        console.log(email);
        if (email.accepted.length != 0) {
            await Applicant.update(
                { submitEmailSentStatus: 1 },
                {
                    where: {
                        applicantId: applicant.dataValues.applicantId
                    }
                }
            )
        }

        console.log("success");
    } catch (error) {
        console.log(error);
    }
}
