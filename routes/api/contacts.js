import express from 'express';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../../schemas/contactAddSchema.js';
import contactService from '../../models/contacts.js';
import { HttpError } from '../../helpers/index.js';
import isEmptyBody from '../../middleware/middleware.js';

const contactsRouter = express.Router();

contactsRouter.get('/', async (req, res, next) => {
  try {
    const result = await contactService.listContacts();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const result = await contactService.getById(req.params.contactId);
    if (result === null) {
      throw HttpError(404, `Not found`);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post('/', isEmptyBody, async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, `missing required name field`);
    }
    const result = await contactService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.put('/:contactId', isEmptyBody, async (req, res, next) => {
  try {
    const { body } = req;
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        `Invalid field value ${error.details[0].context.label}!`
      );
    }

    const result = await contactService.updateContact(
      req.params.contactId,
      req.body
    );
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const result = await contactService.removeContact(req.params.contactId);
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
