import { Component } from '@angular/core';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {}
