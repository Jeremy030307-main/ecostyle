import Joi from "joi";

// Define schema for the details object
const detailsSchema = Joi.object({
    description: Joi.string().optional().allow(null),
    material: Joi.string().optional().allow(null),
    fit: Joi.string().optional().allow(null),
});

export const variantSchema = Joi.object({
  color: Joi.string().required(),
  image: Joi.string().allow(null)
});
  
// Define schema for the main product object with async validation
export const productSchema =  Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    thumbnail: Joi.string().allow(null),
    size: Joi.array().items(Joi.string().valid('S', 'M', 'L', 'XL')).required(),
    details: detailsSchema.required(), 
    category: Joi.string().required(),
    collection: Joi.string().required(),
    variant: Joi.array().items(variantSchema).required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number().min(0),
  thumbnail: Joi.string().allow(null),
  details: detailsSchema, 
  category: Joi.string(),
  collection: Joi.string()
}).or("name","price","thumbnail","details","category","collection");
