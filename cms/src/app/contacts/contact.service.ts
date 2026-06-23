import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contacts.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId = 0;
  private firebaseUrl = environment.firebaseUrl + '/contacts.json';

  constructor(private http: HttpClient) {
    this.contacts = [];
    this.fetchContacts();
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  refreshContacts(): void {
    console.log('Refreshing contacts from Firebase');
    this.fetchContacts();
  }

  private fetchContacts() {
    console.log('Fetching contacts from:', this.firebaseUrl);
    this.http.get<Contact[]>(this.firebaseUrl).subscribe(
      (contacts: Contact[]) => {
        console.log('Contacts fetched:', contacts);
        this.contacts = contacts || [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a: Contact, b: Contact) =>
          a.name.localeCompare(b.name),
        );
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      },
    );
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    console.log('Deleting contact:', contact);
    this.contacts.splice(pos, 1);
    console.log('Contacts after deletion:', this.contacts);
    this.storeContacts();
  }

  storeContacts() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log('Storing contacts to Firebase:', this.contacts);
    this.http.put(this.firebaseUrl, this.contacts, { headers }).subscribe(
      () => {
        console.log('Contacts stored successfully');
        this.contactListChangedEvent.next(this.contacts.slice());
        console.log('ContactListChangedEvent emitted');
      },
      (error: any) => {
        console.error('Error storing contacts:', error);
      },
    );
  }
}

