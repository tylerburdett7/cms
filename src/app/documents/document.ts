import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId = 0;

  documentListChangedEvent = new Subject<Document[]>();

  private firebaseUrl = 'https://wdd430cms-6cb35-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {}

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

  getDocuments(): void {
    this.http.get<Document[]>(this.firebaseUrl).subscribe({
      next: (documents: Document[]) => {
        this.documents = documents ? documents : [];
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        );
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  storeDocuments(): void {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.firebaseUrl, documentsString, { headers }).subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      }
    );
  }

  getDocument(id: string): Document | null {
    for (const doc of this.documents) {
      if (doc.id === id) {
        return doc;
      }
    }
    return null;
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
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

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
