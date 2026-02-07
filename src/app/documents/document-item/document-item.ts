import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-item.html',
  styleUrl: './document-item.css'
})
export class DocumentItem {
  @Input() document!: Document;
  @Output() selected = new EventEmitter<Document>();

  onSelected() {
    this.selected.emit(this.document);
  }
}
