import Joi from "joi";

export const newReviewSchema = Joi.object({
  product: Joi.string()
    .required()
    .messages({
      "string.base": "Product ID must be a string.",
      "any.required": "Product ID is required."
    }),

  rating: Joi.number()
    .required()
    .min(1)
    .max(5)
    .messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating cannot be more than 5.",
      "any.required": "Rating is required."
    }),

  comment: Joi.string()
    .required()
    .min(1)
    .messages({
      "string.base": "Comment must be a string.",
      "string.empty": "Comment cannot be empty.",
      "any.required": "Comment is required."
    })
});

export const updateReviewSchema = Joi.object({
    rating: Joi.number()
      .min(1)
      .max(5)
      .optional(), // Optional field
    comment: Joi.string()
      .trim()
      .optional(), // Optional field
  }).or('rating', 'comment'); // At least one of the fields must be present