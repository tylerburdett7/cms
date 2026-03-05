import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document';

@Component({
  selector: 'cms-document-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit {
  originalDocument: Document | null = null;
  document: Document | null = null;
  editMode = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id == null || id === '') {
        this.editMode = false;
        this.document = new Document('', '', '', '', null);
        return;
      }
      this.originalDocument = this.documentService.getDocument(id);
      if (this.originalDocument == null) {
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(
        JSON.stringify(this.originalDocument)
      ) as Document;
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const children = this.editMode && this.originalDocument
      ? this.originalDocument.children
      : null;
    const newDocument = new Document(
      '',
      value.name,
      value.description ?? '',
      value.url ?? '',
      children
    );
    if (this.editMode && this.originalDocument) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigateByUrl('/documents');
  }

  onCancel(): void {
    this.router.navigateByUrl('/documents');
  }
}
