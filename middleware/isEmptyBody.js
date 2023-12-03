import { HttpError } from '../helpers/index.js';

const isEmptyBody = async (req, res, next) => {
  const keys = Object.keys(req.body);
  const files = req.file;
  if (!keys.length && !files) {
    return next(HttpError(400, 'Missing fields'));
  }
  next();
};
export default isEmptyBody;
