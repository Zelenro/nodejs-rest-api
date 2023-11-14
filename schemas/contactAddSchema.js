import Joi from 'joi';

export const contactAddSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({ 'any.required': 'Missing required name field' }),
  email: Joi.string()
    .email()
    .required()
    .messages({ 'any.required': 'Missing required email field' }),
  phone: Joi.string()
    .required()
    .messages({ 'any.required': 'Missing required phone field' }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[0-9() -]+$/)
    .messages({
      'string.pattern.base':
        'Must contain only numbers, brackets, spaces and dashes. Example: 000-00-00 or (000) 00 00.',
    }),
});
