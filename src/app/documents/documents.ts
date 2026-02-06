import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Document } from './document.model';
import { DocumentList } from './document-list/document-list';
import { DocumentDetail } from './document-detail/document-detail';

@Component({
  selector: 'cms-documents',
  standalone: true,
  imports: [CommonModule, DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents {
  selectedDocument: Document | null = null;
}
