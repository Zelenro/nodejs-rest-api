import Joi from 'joi';

export const contactAddSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z ]*$/)
    .min(2)
    .max(30)
    .required()
    .messages({
      'any.required': 'Missing required name field',
      'string.pattern.base':
        'Will only allow letters (uppercase and lowercase) and spaces in the string',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({ 'any.required': 'Missing required email field' }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9() -]+$/)
    .messages({
      'any.required': 'Missing required phone field',
      'string.pattern.base':
        'Must contain only numbers, brackets, spaces and dashes. Example: 000-00-00 or (000) 00 00.',
    }),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z ]*$/)
    .min(2)
    .max(30)
    .messages({
      'string.pattern.base':
        'Will only allow letters (uppercase and lowercase) and spaces in the string',
    }),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[0-9() -]+$/)
    .messages({
      'string.pattern.base':
        'Must contain only numbers, brackets, spaces and dashes. Example: 000-00-00 or (000) 00 00.',
    }),
  favorite: Joi.boolean(),
});

export const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ 'any.required': 'Missing required favorite field' }),
});
