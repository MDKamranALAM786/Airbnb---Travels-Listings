import Joi from "joi";

export const reviewSchema = Joi.object({
    review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5),
        created_at : Joi.string()
    }).required()
});
