import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Document } from '../document.model';
import { DocumentService } from '../document';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css'
})
export class DocumentDetail implements OnInit {
  document: Document | null = null;
  nativeWindow: Window | null = null;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private windRefService: WindRefService
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.windRefService.getNativeWindow();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.document = this.documentService.getDocument(id);
      }
    });
  }

  onView(): void {
    if (this.document?.url && this.nativeWindow) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete(): void {
    if (!this.document) return;
    this.documentService.deleteDocument(this.document);
    this.router.navigateByUrl('/documents');
  }
}
