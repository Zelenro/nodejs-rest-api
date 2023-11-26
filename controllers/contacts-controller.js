import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const listContacts = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const totalCount = await Contact.countDocuments({ owner });

    const lastPageContacts = totalCount % limit;
    const dynamicLimit =
      page < Math.ceil(totalCount / limit) ? limit : lastPageContacts;

    const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
      skip,
      limit: dynamicLimit,
    }).populate('owner', 'email subscription');

    res.status(200).json({
      totalCount,
      page,
      contactsPerPage: dynamicLimit,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findById({ _id: id, owner });
    if (result === null) {
      throw HttpError(404, `Not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner });
    if (!result) {
      res.status(404).json({ message: 'Not found' });
    }
    req.params.id, req.body;
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (typeof favorite === 'undefined') {
      return res.status(400).json({ message: 'Missing field favorite' });
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({ _id: id, owner });
    if (!result) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'Contact deleted!' });
  } catch (error) {
    next(error);
  }
};

export default {
  listContacts: ctrlWrapper(listContacts),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  removeContact: ctrlWrapper(removeContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
