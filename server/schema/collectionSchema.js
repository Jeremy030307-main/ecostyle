import Joi from 'joi';

export const newCollectionSchema = Joi.object({
    code: Joi.string()
      .alphanum()
      .max(10)
      .required()
      .messages({
        'string.empty': 'Code is required.',
        'string.alphanum': 'Code must only contain letters and numbers.',
        'string.max': 'Code must not exceed 10 characters.',
      }),
  
    name: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.empty': 'Name is required.',
        'string.max': 'Name must not exceed 100 characters.',
      }),
  
    description: Joi.string()
      .max(2000)
      .required()
      .messages({
        'string.empty': 'Description is required.',
        'string.max': 'Description must not exceed 2000 characters.',
      }),
  
    thumbnail: Joi.string()
      .uri()
      .messages({
        'string.empty': 'Thumbnail is required.',
        'string.uri': 'Thumbnail must be a valid URL.',
      })
});

export const updateCollectionSchema = Joi.object({
    description: Joi.string()
      .max(2000)
      .messages({
        'string.empty': 'Description is required.',
        'string.max': 'Description must not exceed 2000 characters.',
      }),
  
    thumbnail: Joi.string()
      .uri()
      .messages({
        'string.empty': 'Thumbnail is required.',
        'string.uri': 'Thumbnail must be a valid URL.',
      })
}).or('description', 'thumbnail');;