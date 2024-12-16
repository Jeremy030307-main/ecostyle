import Joi from 'joi';

const parentNodeSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    subcategory: Joi.link('#subcategorySchema')
});

const leafNodeSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required()
});

const nodeSchema = Joi.alternatives().conditional(Joi.object({ subcategory: Joi.any() }).unknown(), {
    then: parentNodeSchema,
    otherwise: leafNodeSchema
});

const subcategorySchema = Joi.array().items(nodeSchema).required().id('subcategorySchema');

export const categorySchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    subcategory: subcategorySchema
});
