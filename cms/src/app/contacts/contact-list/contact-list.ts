import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../contacts.model';
import { ContactItem } from '../contact-item/contact-item';
import { ContactService } from '../contact.service';
import { ContactsFilterPipe } from '../contacts-filter-pipe';

interface ContactSection {
  title: string;
  members: Contact[];
}

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, ContactItem, RouterLink, ContactsFilterPipe],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit, OnDestroy {
  contactSections: ContactSection[] = [];
  standaloneContacts: Contact[] = [];
  subscription!: Subscription;
  term: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    console.log('ContactList ngOnInit started');
    
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (updatedContacts: Contact[]) => {
        console.log('ContactListChangedEvent received with contacts:', updatedContacts);
        console.log('Building new sections from updated contacts');
        this.standaloneContacts = updatedContacts
          .filter(
            (contact: Contact) =>
              !Array.isArray(contact.group) || contact.group.length === 0,
          )
          .sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
        this.contactSections = this.buildSections(updatedContacts);
        console.log('Sections updated:', this.contactSections);
      },
    );
    
    console.log('Refreshing contacts from Firebase');
    this.contactService.refreshContacts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(value: string) {
    this.term = value;
  }

  private buildSections(contacts: Contact[]): ContactSection[] {
    const existingMemberIds = new Set(
      contacts
        .filter(
          (contact: Contact) =>
            !Array.isArray(contact.group) || contact.group.length === 0,
        )
        .map((contact: Contact) => contact.id),
    );

    const teamContacts = contacts.filter(
      (contact: Contact) => Array.isArray(contact.group) && contact.group.length > 0,
    );

    return teamContacts
      .map((team: Contact) => {
        const members = [...team.group]
          .filter((member: Contact) => existingMemberIds.has(member.id))
          .sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));

        return {
          title: team.name,
          members,
        };
      })
      .filter((section: ContactSection) => section.members.length > 0);
  }
}
