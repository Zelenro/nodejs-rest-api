import express from 'express';
import {
  authenticate,
  isEmptyBody,
  isEmptyFavorite,
  isValidId,
} from '../../middleware/index.js';
import validateBody from '../../decorators/validateBody.js';
import contactsController from '../../controllers/contacts-controller.js';
import {
  contactAddSchema,
  contactFavoriteSchema,
  contactUpdateSchema,
} from '../../schemas/contactAddSchema.js';

const contactsRouter = express.Router();

contactsRouter.use(authenticate);
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
