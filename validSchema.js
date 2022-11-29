const baseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }

    }
});

const joi = baseJoi.extend(extension);

const campgroundSchema = new joi.object({
    campground: joi.object({
        city: joi.string().required().escapeHTML(),
        population: joi.number().required(),
        state: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        image: {
            url: joi.string(),
            filename: joi.string().escapeHTML()
        },
        description: joi.string().required().escapeHTML(),
    }).required()
})

const reviewSchema = new joi.object({
    review: joi.object({
        body: joi.string().required().escapeHTML(),
        rating: joi.number().required().min(0).max(5),
    }).required()
})

module.exports = { campgroundSchema, reviewSchema };