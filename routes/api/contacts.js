import express from 'express';
import isEmptyBody from '../../middleware/middleware.js';
import isValidId from '../../middleware/isValidId.js';
import isEmptyFavorite from '../../middleware/isEmptyFavorite.js';
import validateBody from '../../decorators/validateBody.js';
import contactsController from '../../controllers/contacts-controller.js';
import {
  contactAddSchema,
  contactFavoriteSchema,
  contactUpdateSchema,
} from '../../schemas/contactAddSchema.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.listContacts);

contactsRouter.get('/:id', isValidId, contactsController.getById);

contactsRouter.post(
  '/',
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.addContact
);

contactsRouter.put(
  '/:id',
  isValidId,
  isEmptyBody,
  validateBody(contactUpdateSchema),
  contactsController.updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  isEmptyFavorite,
  validateBody(contactFavoriteSchema),
  contactsController.updateStatusContact
);

contactsRouter.delete('/:id', isValidId, contactsController.removeContact);

export default contactsRouter;
