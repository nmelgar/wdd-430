import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId = 0;
  private firebaseUrl = environment.firebaseUrl + '/documents.json';

  constructor(private http: HttpClient) {
    this.documents = [];
    this.fetchDocuments();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  refreshDocuments(): void {
    console.log('Refreshing documents from Firebase');
    this.fetchDocuments();
  }

  private fetchDocuments() {
    console.log('Fetching documents from:', this.firebaseUrl);
    this.http.get<Document[]>(this.firebaseUrl).subscribe(
      (documents: Document[]) => {
        console.log('Documents fetched:', documents);
        this.documents = documents || [];
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a: Document, b: Document) =>
          a.name.localeCompare(b.name),
        );
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
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

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    console.log('Deleting document:', document);
    this.documents.splice(pos, 1);
    console.log('Documents after deletion:', this.documents);
    this.storeDocuments();
  }

  storeDocuments() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log('Storing documents to Firebase:', this.documents);
    this.http.put(this.firebaseUrl, this.documents, { headers }).subscribe(
      () => {
        console.log('Documents stored successfully');
        this.documentListChangedEvent.next(this.documents.slice());
        console.log('DocumentListChangedEvent emitted');
      },
      (error: any) => {
        console.error('Error storing documents:', error);
      },
    );
  }
}


