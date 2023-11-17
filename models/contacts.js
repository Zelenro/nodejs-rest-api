import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { HttpError } from '../helpers/index.js';

const contactsPath = path.resolve('models', './contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getById(contactId) {
  try {
    const id = String(contactId);
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contact = contacts.find(item => item.id === id);
    return contact || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addContact({ name, email, phone }) {
  try {
    const newContact = {
      id: nanoid(),
      name: name,
      email: email,
      phone: phone,
    };
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateContact(contactId, updatedFields) {
  try {
    const id = String(contactId);
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contactIndex = contacts.findIndex(item => item.id === id);
    if (contactIndex === -1) {
      throw HttpError(404, `Not found`);
    }
    contacts[contactIndex] = { ...contacts[contactIndex], ...updatedFields };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[contactIndex];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const id = String(contactId);
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const index = contacts.findIndex(item => item.id === id);
    if (index === -1) {
      throw HttpError(404, `Not found`);
    }
    const removedContact = { ...contacts[index] };
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  contactsPath,
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
