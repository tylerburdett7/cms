import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId = 0;

  messageChangedEvent = new Subject<Message[]>();

  private messagesUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessages(): void {
    this.http
      .get<{ message: string; messages: Message[] }>(this.messagesUrl)
      .subscribe({
        next: (response) => {
          this.messages = response.messages ? response.messages : [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message): void {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; msg: Message }>(this.messagesUrl, message, {
        headers
      })
      .subscribe({
        next: (responseData) => {
          this.messages.push(responseData.msg);
          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }
}
