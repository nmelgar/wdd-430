import { Component } from '@angular/core';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'cms-contacts',
  imports: [ContactList],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {}
