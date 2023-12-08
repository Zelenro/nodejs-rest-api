import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { authenticate, isEmptyBody, upload } from '../../middleware/index.js';
import validateBody from '../../decorators/validateBody.js';
import {
  userEmailSchema,
  userSigninSchema,
  userSignupSchema,
} from '../../models/User.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  upload.single('avatarURL'),
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.post(
  '/verify',
  isEmptyBody,
  validateBody(userEmailSchema),
  authController.resendVerify
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
