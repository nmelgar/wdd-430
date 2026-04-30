import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header';
import { Contacts } from './contacts/contacts'

@Component({
  selector: 'cms-root',
  imports: [
    RouterOutlet, 
    HeaderComponent,
    Contacts
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cms');
}
