const Joi = require('joi');

exports.createApplicant = Joi.object({
    userId: Joi.number().required(),
    phoneNumber: Joi.number().required(),
    addLine1: Joi.string().required(),
}).options({ allowUnknown: false });