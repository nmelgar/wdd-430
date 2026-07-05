import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  private documentsUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {
    this.documents = [];
    this.fetchDocuments();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  refreshDocuments(): void {
    this.fetchDocuments();
  }

  private fetchDocuments() {
    this.http
      .get<{ message: string; documents: Document[] }>(this.documentsUrl)
      .subscribe(
      (responseData) => {
        this.documents = responseData.documents || [];
        this.documents.sort((a: Document, b: Document) =>
          a.name.localeCompare(b.name),
        );
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
      },
    );
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }

    return null;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    newDocument.id = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post<{ message: string; document: Document }>(
        this.documentsUrl,
        newDocument,
        { headers: headers },
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .put(this.documentsUrl + '/' + originalDocument.id, newDocument, {
        headers: headers,
      })
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(this.documentsUrl + '/' + document.id).subscribe(() => {
      this.documents.splice(pos, 1);
      this.sortAndSend();
    });
  }

  private sortAndSend(): void {
    this.documents.sort((a: Document, b: Document) =>
      a.name.localeCompare(b.name),
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }
}


