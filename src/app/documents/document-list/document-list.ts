import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Document } from '../document.model';
import { DocumentItem } from '../document-item/document-item';

// IMPORTANT: service file is document.ts
import { DocumentService } from '../document';

@Component({
  selector: 'cms-document-list',
  standalone: true,
  imports: [CommonModule, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css'
})
export class DocumentList implements OnInit {
  documents: Document[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
  }

  onSelected(document: Document) {
    this.documentService.documentSelectedEvent.emit(document);
  }
}
