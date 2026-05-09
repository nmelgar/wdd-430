import { Component, Input } from '@angular/core';
import { Contact } from '../contacts.model';

@Component({
  selector: 'cms-contact-item',
  standalone: true,
  imports: [],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;
}
