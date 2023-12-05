import User from '../models/User.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import HttpError from '../helpers/HttpError.js';
import Jimp from 'jimp';

const avatarsPath = path.resolve('public', 'avatars');

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  let avatarURL = req.file;
  if (!avatarURL) {
    avatarURL =
      avatarURL || gravatar.url(email, { s: '250', r: 'pg', d: 'mm' });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, 'Email already exist');
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const processImage = async (inputPath, outputPath, width, height) => {
  try {
    const image = await Jimp.read(inputPath);
    await image.resize(width, height);
    await image.writeAsync(outputPath);
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (!req.file) {
    throw HttpError(400, 'File is missing');
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      throw HttpError(401, 'Not authorized');
    }
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    await processImage(newPath, newPath, 250, 250);
    const avatarURL = path.join('avatars', filename);
    const result = await User.findByIdAndUpdate(id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  await User.findByIdAndUpdate(user.id, { token });
  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).end();
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
