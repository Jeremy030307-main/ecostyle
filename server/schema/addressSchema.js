import Joi from "joi";

export const addressSchema = Joi.object({
    addressName: Joi.string().min(1).max(100).required().messages({
      'string.empty': 'Address name is required.',
      'string.base': 'Address name must be a string.',
      'string.min': 'Address name must have at least 1 character.',
      'string.max': 'Address name cannot exceed 100 characters.',
    }),
    name: Joi.string().min(1).max(50).required().messages({
      'string.empty': 'First name is required.',
      'string.base': 'First name must be a string.',
      'string.min': 'First name must have at least 1 character.',
      'string.max': 'First name cannot exceed 50 characters.',
    }),
    line1: Joi.string().min(5).max(255).required().messages({
      'string.empty': 'Address is required.',
      'string.base': 'Address must be a string.',
      'string.min': 'Address must have at least 5 characters.',
      'string.max': 'Address cannot exceed 255 characters.',
    }),
    line2: Joi.string().min(5).max(255).messages({
      'string.empty': 'Address is required.',
      'string.base': 'Address must be a string.',
      'string.min': 'Address must have at least 5 characters.',
      'string.max': 'Address cannot exceed 255 characters.',
    }),
    city: Joi.string().min(1).max(100).required().messages({
      'string.empty': 'City is required.',
      'string.base': 'City must be a string.',
      'string.min': 'City must have at least 1 character.',
      'string.max': 'City cannot exceed 100 characters.',
    }),
    state: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'State is required.',
      'string.base': 'State must be a string.',
      'string.min': 'State must have at least 2 characters.',
      'string.max': 'State cannot exceed 100 characters.',
    }),
    country: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Country is required.',
      'string.base': 'Country must be a string.',
      'string.min': 'Country must have at least 2 characters.',
      'string.max': 'Country cannot exceed 100 characters.',
    }),
    postalCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
      'string.empty': 'Postal code is required.',
      'string.base': 'Postal code must be a string.',
      'string.pattern.base': 'Postal code must be in a valid format (e.g., 12345 or 12345-6789).',
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).messages({
      'string.base': 'Phone number must be a string.',
      'string.pattern.base': 'Phone number must be in a valid format (e.g., +1234567890).',
    }),
  });
  