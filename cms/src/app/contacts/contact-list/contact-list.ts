import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../contacts.model';
import { ContactItem } from '../contact-item/contact-item';

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, ContactItem],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [
    new Contact(
      '1',
      'R. Kent Jackson',
      'jacksonk@byui.edu',
      '208-496-3771',
      'assets/images/jacksonk.jpg',
      [],
    ),
    new Contact(
      '2',
      'Rex Barzee',
      'barzeer@byui.edu',
      '208-496-3768',
      'assets/images/barzeer.jpg',
      [],
    ),
  ];

  onSelected(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }
}
