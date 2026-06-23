import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contacts.model';

@Pipe({
  name: 'contactsFilter',
  standalone: true,
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    if (!term || term.length < 1) {
      return contacts;
    }

    return contacts.filter((contact: Contact) =>
      contact.name.toLowerCase().includes(term.toLowerCase()),
    );
  }
}
