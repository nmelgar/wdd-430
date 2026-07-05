import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contacts.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  private contactsUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {
    this.contacts = [];
    this.fetchContacts();
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  refreshContacts(): void {
    this.fetchContacts();
  }

  private fetchContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(this.contactsUrl)
      .subscribe(
      (responseData) => {
        this.contacts = responseData.contacts || [];
        this.contacts.sort((a: Contact, b: Contact) =>
          a.name.localeCompare(b.name),
        );
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
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

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    newContact.id = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post<{ message: string; contact: Contact }>(this.contactsUrl, newContact, {
        headers: headers,
      })
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .put(this.contactsUrl + '/' + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe(() => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(this.contactsUrl + '/' + contact.id).subscribe(() => {
      this.contacts.splice(pos, 1);
      this.sortAndSend();
    });
  }

  private sortAndSend(): void {
    this.contacts.sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}

