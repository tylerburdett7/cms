import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
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
export class MessageList implements OnInit, OnDestroy {
  messages: Message[] = [];
  subscription!: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
    this.messageService.getMessages();
  }

  onAddMessage(message: Message): void {
    this.messageService.addMessage(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
