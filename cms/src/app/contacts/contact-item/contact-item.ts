import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Contact } from '../contacts.model';

@Component({
  selector: 'cms-contact-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;
}
