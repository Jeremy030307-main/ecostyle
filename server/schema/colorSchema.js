import Joi from 'joi';


export const newColorSchema = Joi.object({
    id: Joi.string().required().min(1), // Ensures 'id' is a non-empty string
    name: Joi.string().required(),     // Ensures 'name' is a required string
    colorCode: Joi.string()            // Ensures 'colorCode' is a string
      .required()
      .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/) // Validates hex color code format
      .message("colorCode must be a valid hexadecimal color string starting with #"),
  });
