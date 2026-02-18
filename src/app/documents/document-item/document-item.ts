import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './document-item.html',
  styleUrl: './document-item.css'
})
export class DocumentItem {
  @Input() document!: Document;
}
