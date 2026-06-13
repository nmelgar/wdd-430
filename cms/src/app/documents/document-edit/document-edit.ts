import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit {
  originalDocument: Document | null = null;
  document: Document | null = null;
  editMode = false;
  id = '';

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (this.id == null) {
        this.editMode = false;
        this.document = new Document('', '', '', '', []);
        return;
      }

      this.originalDocument = this.documentService.getDocument(this.id);
      if (this.originalDocument == null) {
        return;
      }

      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newDocument = new Document(
      '',
      value.name,
      value.description,
      value.url,
      this.originalDocument?.children ?? [],
    );

    if (this.editMode && this.originalDocument) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigateByUrl('/documents');
  }

  onCancel(): void {
    this.router.navigateByUrl('/documents');
  }
}
