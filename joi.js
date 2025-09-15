const joi = require("joi");

const schema = joi.object({
    listing:joi.object({
    title:joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(1),
   image: joi.any(),
    location: joi.string().required(),
    country: joi.string().required()
})
}).required()



const reviewSchema = joi.object({
    review: joi.object({
        Comment: joi.string().required(),
        rating: joi.number().min(1).max(5).required()
    })
}).required()

module.exports = {schema,reviewSchema};