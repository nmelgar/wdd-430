import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentList } from './document-list/document-list';
import { DocumentDetail } from './document-detail/document-detail';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  standalone: true,
  imports: [CommonModule, DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  selectedDocument: Document | null = null;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.documentSelectedEvent.subscribe((document: Document) => {
      this.selectedDocument = document;
    });
  }
}
