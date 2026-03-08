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

  private firebaseUrl = 'https://wdd430cms-6cb35-default-rtdb.firebaseio.com/messages.json';

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
    this.http.get<Message[]>(this.firebaseUrl).subscribe(
      (messages: Message[]) => {
        this.messages = messages ? messages : [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next(this.messages.slice());
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  storeMessages(): void {
    const messagesString = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.firebaseUrl, messagesString, { headers }).subscribe(
      () => {
        this.messageChangedEvent.next(this.messages.slice());
      }
    );
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
    this.maxMessageId++;
    message.id = String(this.maxMessageId);
    this.messages.push(message);
    this.storeMessages();
  }
}
