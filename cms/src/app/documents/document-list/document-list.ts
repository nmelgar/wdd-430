import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [CommonModule, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
  new Document(
    '1',
    'CIT 260 - Object Oriented Programming',
    'Focuses on object-oriented programming concepts and design.',
    ''
  ),
  new Document(
    '2',
    'CIT 366 - Full Web Stack Development',
    'Learn how to develop modern web applications using the MEAN stack.',
    'https://content.byui.edu/file/b7c3e56d-6947-497f-9d32-4e5b6b397cac/1/CIT%20366%20course%20description.pdf'
  ),
  new Document(
    '3',
    'CIT 425 - Data Warehousing',
    'Covers data storage, ETL processes, and data warehouse design.',
    ''
  ),
  new Document(
    '4',
    'CIT 460 - Enterprise Development',
    'Explores enterprise-level application development and architecture.',
    ''
  ),
  new Document(
    '5',
    'CIT 495 - Senior Practicum',
    'Capstone project integrating skills learned throughout the program.',
    ''
  ),
];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
