import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header';
import { Contacts } from './contacts/contacts';
import { Documents } from './documents/documents';
import { MessageList } from './messages/message-list/message-list';

@Component({
  selector: 'cms-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, Documents, MessageList, Contacts],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  selectedFeature = 'documents';

  switchView(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
  }
}
