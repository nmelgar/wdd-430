import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [ContactList, RouterOutlet],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit {
  ngOnInit(): void {}
}
