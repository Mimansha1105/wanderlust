const Joi = require('joi');

module.exports.listingschema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.object({
            url: Joi.string(),
            filename: Joi.string()
  }).optional(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  country: Joi.string().required()
});

module.exports.reviewschema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),   // ✅ fixed
    comment: Joi.string().required()   // ✅ fixed
  }).required()
});
