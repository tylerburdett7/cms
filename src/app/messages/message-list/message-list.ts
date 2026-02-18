import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Message } from '../message.model';
import { MessageItem } from '../message-item/message-item';
import { MessageEdit } from '../message-edit/message-edit';

// IMPORTANT: your service file is message.ts
import { MessageService } from '../message';

@Component({
  selector: 'cms-message-list',
  standalone: true,
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // initial load
    this.messages = this.messageService.getMessages();

    // listen for changes
    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }

    onAddMessage(message: Message) {
    this.messageService.addMessage(message);
  }

}
