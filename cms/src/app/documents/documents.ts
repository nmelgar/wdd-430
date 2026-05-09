import { Component } from '@angular/core';
import { DocumentList } from './document-list/document-list';
import { DocumentDetail } from './document-detail/document-detail';

@Component({
  selector: 'cms-documents',
  standalone: true,
  imports: [DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {}
