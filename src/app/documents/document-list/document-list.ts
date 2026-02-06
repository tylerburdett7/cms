import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Document } from '../document.model';
import { DocumentItem } from './document-item/document-item';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [CommonModule, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css'
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Doc One', 'Description One', 'https://example.com/1', []),
    new Document('2', 'Doc Two', 'Description Two', 'https://example.com/2', []),
    new Document('3', 'Doc Three', 'Description Three', 'https://example.com/3', []),
    new Document('4', 'Doc Four', 'Description Four', 'https://example.com/4', [])
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
