import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactService } from '../contact';

@Component({
  selector: 'cms-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css'
})
export class ContactDetail implements OnInit {
  contact: Contact | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.contact = this.contactService.getContact(id);
      }
    });
  }

  onDelete(): void {
    if (!this.contact) return;
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
}
