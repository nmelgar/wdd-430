import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactList } from './contact-list/contact-list';
import { ContactDetail } from './contact-detail/contact-detail';
import { Contact } from './contacts.model';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [CommonModule, ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {
  selectedContact: Contact | null = null;
}
