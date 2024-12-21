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
