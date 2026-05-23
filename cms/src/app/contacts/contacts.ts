import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactList } from './contact-list/contact-list';
import { ContactDetail } from './contact-detail/contact-detail';
import { Contact } from './contacts.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [CommonModule, ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit {
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.contactSelectedEvent.subscribe((contact: Contact) => {
      this.selectedContact = contact;
    });
  }
}
