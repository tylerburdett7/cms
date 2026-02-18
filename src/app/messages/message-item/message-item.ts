import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';

// IMPORTANT: your service file is contact.ts
import { ContactService } from '../../contacts/contact';

@Component({
  selector: 'cms-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css'
})
export class MessageItem implements OnInit {
  @Input() message: Message | null = null;

  messageSender: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    if (!this.message) return;

    const contact: Contact | null = this.contactService.getContact(this.message.sender);

    if (contact) {
      this.messageSender = contact.name;
    } else {
      this.messageSender = 'Unknown Sender';
    }
  }
}
