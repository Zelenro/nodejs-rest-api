import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { authenticate, isEmptyBody, upload } from '../../middleware/index.js';
import validateBody from '../../decorators/validateBody.js';
import { userSigninSchema, userSignupSchema } from '../../models/User.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post(
  '/login',
  isEmptyBody,
  validateBody(userSigninSchema),
  authController.login
);

authRouter.get('/current', authenticate, authController.getCurrent);
authRouter.post('/logout', authenticate, authController.logout);

authRouter.patch(
  '/avatars',
  upload.single('avatarURL'),
  isEmptyBody,
  authenticate,
  authController.updateAvatar
);

export default authRouter;
