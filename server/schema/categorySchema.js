import Joi from 'joi';

const parentNodeSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
    subcategories: Joi.link('#subcategorySchema')
});

const leafNodeSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required()
});

const nodeSchema = Joi.alternatives().conditional(Joi.object({ subcategories: Joi.any() }).unknown(), {
    then: parentNodeSchema,
    otherwise: leafNodeSchema
});

const subcategorySchema = Joi.array().items(nodeSchema).id('subcategorySchema');

export const categorySchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
    subcategories: subcategorySchema
});

export const sizeGuideSchema = Joi.object({
    size_guide: Joi.array().items(
      Joi.object({
        Size: Joi.string()
          .valid('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL') // Restrict valid sizes if appropriate
          .required(),
        // Allow any combination of the following fields
        Chest: Joi.number().positive(),
        Waist: Joi.number().positive(),
        Hip: Joi.number().positive(),
        "Arm Length": Joi.number().positive()
      }).or('Chest', 'Waist', 'Hip', 'Arm Length') // Ensure at least one field besides Size is present
    ).required()
  });
  