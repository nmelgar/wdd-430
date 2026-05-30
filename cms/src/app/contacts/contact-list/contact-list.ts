import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  imports: [CommonModule, ContactItem, RouterLink],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {
  contactSections: ContactSection[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    const contacts = this.contactService.getContacts();
    this.contactSections = this.buildSections(contacts);

    this.contactService.contactChangedEvent.subscribe((updatedContacts: Contact[]) => {
      this.contactSections = this.buildSections(updatedContacts);
    });
  }

  private buildSections(contacts: Contact[]): ContactSection[] {
    const teamContacts = contacts.filter((contact: Contact) =>
      Array.isArray(contact.group) && contact.group.length > 0,
    );

    return teamContacts.map((team: Contact) => ({
      title: team.name,
      members: [...team.group].sort((a: Contact, b: Contact) =>
        a.name.localeCompare(b.name),
      ),
    }));
  }
}
