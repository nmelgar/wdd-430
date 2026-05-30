import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contacts.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    this.contacts = this.contacts
      .filter((existingContact: Contact) => existingContact.id !== contact.id)
      .map((existingContact: Contact) => {
        if (!Array.isArray(existingContact.group)) {
          return existingContact;
        }

        existingContact.group = existingContact.group.filter(
          (member: Contact) => member.id !== contact.id,
        );
        return existingContact;
      });

    this.contactChangedEvent.emit(this.contacts.slice());
  }
}
