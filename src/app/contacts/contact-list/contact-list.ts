import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactItem } from '../contact-item/contact-item';

// IMPORTANT: service file is contact.ts
import { ContactService } from '../contact';

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, ContactItem, RouterModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription!: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
