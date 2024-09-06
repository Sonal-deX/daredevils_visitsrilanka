const Joi = require('joi');

exports.createAdminValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
}).options({ allowUnknown: false });

exports.adminLoginValidator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
}).options({ allowUnknown: false });