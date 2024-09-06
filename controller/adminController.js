const Admin = require('../model/admin')
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const { createToken } = require('../JWT/jwtConfigue')

const nodemailer = require('nodemailer');

// Create a transporter with Gmail configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sonalattanayake2002@gmail.com', // your Gmail email address
        pass: 'byef ktzh qiwf infn '// your Gmail email password
    }
});

// In-memory store for OTPs (in a real-world scenario, use a database)
const otpStore = new Map();

exports.getOTP = async (req, res, next) => {
    try {
        // Generate OTP
        const generateOtp = () => {
            return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
        };

        const otp = generateOtp();
        otpStore.set("sparkzsoftwares@gmail.com", otp);
        const mailOptions = {
            from: 'sonalattanayake2002@gmail.com',
            to: "sparkzsoftwares@gmail.com",
            subject: 'New User OTP',
            text: `OTP code is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('OTP sent to sparkzsoftwares@gmail.com email');

    } catch (err) {
        next(err)
    }

}

// Create a new user
exports.createAdmin = async (req, res, next) => {

    var {
        name,
        email,
        password,
    } = req.body;

    bcrypt.genSalt(10, async (err, salt) => {
        if (err) {
            throw err;
        } else {
            // Hash the password using the generated salt
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    throw err;
                } else {
                    password = hash
                    try {
                        const newAdmin = await Admin.create({
                            name,
                            email,
                            password,
                            status: 1,
                        });
                        createToken(newAdmin)
                            .then(token => {
                                res.json({ token, email: newAdmin.email, id: newAdmin.adminId });
                                res.status(201);
                            })
                            .catch(error => {
                                var error = new Error('Error generating token')
                                error.status = 500
                                next(error)
                            });
                    } catch (error) {
                        error.status = 403
                        next(error)
                    }
                }
            });
        }
    });

}

// login controller
exports.adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const user = await Admin.findOne({
            where: {
                email
            }
        })
        if (user) {
            const pwCompare = await bcrypt.compare(password, user.password)
            if (pwCompare) {
                createToken(user)
                    .then(token => {
                        res.json({ token, email: user.email, id: user.adminId });
                        res.status(204);
                    })
                    .catch(error => {
                        var error = new Error('Error generating token')
                        error.status = 500
                        next(error)
                    });
            } else {
                next({ stack: 'User Password Wrong try again', message: 'User Password Wrong try again', status: 401 })
            }
        } else {
            next({ stack: 'User not found with given email', message: 'User not found with given email', status: 404 })
        }

    } catch (error) {
        next(error)
    }
};