import {ContactRepository} from "./contacts.repository.js";
import {contactsDao} from "../models/factory.js";

export const contactService = new ContactRepository(contactsDao);