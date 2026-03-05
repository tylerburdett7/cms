import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact';
import { ContactItem } from '../contact-item/contact-item';

@Component({
  selector: 'cms-contact-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactItem],
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEdit implements OnInit {
  originalContact: Contact | null = null;
  contact: Contact | null = null;
  groupContacts: Contact[] = [];
  editMode = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id == null || id === '') {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', null);
        return;
      }
      this.originalContact = this.contactService.getContact(id);
      if (this.originalContact == null) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(
        JSON.stringify(this.originalContact)
      ) as Contact;
      if (this.contact.group) {
        this.groupContacts = JSON.parse(
          JSON.stringify(this.contact.group)
        ) as Contact[];
      } else {
        this.groupContacts = [];
      }
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone ?? '',
      value.imageUrl ?? '',
      this.groupContacts.length > 0 ? this.groupContacts : null
    );
    if (this.editMode && this.originalContact) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigateByUrl('/contacts');
  }

  onCancel(): void {
    this.router.navigateByUrl('/contacts');
  }

  onRemoveItem(index: number): void {
    this.groupContacts.splice(index, 1);
  }
}
