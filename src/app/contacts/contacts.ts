import { Component } from '@angular/core';
import { Contact } from './contact.model';
import { ContactList } from './contact-list/contact-list';
import { ContactDetail } from './contact-detail/contact-detail';

@Component({
  selector: 'cms-contacts',
  standalone: true,
  imports: [ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class ContactsComponent {
  selectedContact: Contact | null = null;

  onContactSelected(contact: Contact) {
    this.selectedContact = contact;
  }
}
