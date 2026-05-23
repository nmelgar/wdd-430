import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../contacts.model';
import { ContactItem } from '../contact-item/contact-item';
import { ContactService } from '../contact.service';

interface ContactSection {
  title: string;
  members: Contact[];
}

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, ContactItem],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {
  contactSections: ContactSection[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    const contacts = this.contactService.getContacts();
    const teamContacts = contacts.filter((contact: Contact) =>
      Array.isArray(contact.group) && contact.group.length > 0,
    );

    this.contactSections = teamContacts.map((team: Contact) => ({
      title: team.name,
      members: [...team.group].sort((a: Contact, b: Contact) =>
        a.name.localeCompare(b.name),
      ),
    }));
  }

  onSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
