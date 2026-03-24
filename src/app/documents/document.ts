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

  private documentsUrl = 'http://localhost:3000/documents';

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

  sortAndSend(): void {
    this.documents.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments(): void {
    this.http
      .get<{ message: string; documents: Document[] }>(this.documentsUrl)
      .subscribe({
        next: (response) => {
          this.documents = response.documents ? response.documents : [];
          this.maxDocumentId = this.getMaxId();
          this.sortAndSend();
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  getDocument(id: string): Document | null {
    for (const doc of this.documents) {
      if (doc.id === id) {
        return doc;
      }
    }
    return null;
  }

  addDocument(document: Document): void {
    if (!document) {
      return;
    }

    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; document: Document }>(
        this.documentsUrl,
        document,
        { headers }
      )
      .subscribe({
        next: (responseData) => {
          this.documents.push(responseData.document);
          this.sortAndSend();
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    (newDocument as Document & { _id?: string })._id = (
      originalDocument as Document & { _id?: string }
    )._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(
        this.documentsUrl + '/' + originalDocument.id,
        newDocument,
        { headers }
      )
      .subscribe({
        next: () => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.documentsUrl + '/' + document.id).subscribe({
      next: () => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }
}
