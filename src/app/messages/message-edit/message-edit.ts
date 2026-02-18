import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css'
})
export class MessageEdit {
  @ViewChild('subject') subjectInputRef!: ElementRef;
  @ViewChild('msgText') msgTextInputRef!: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = '1'; // IMPORTANT: should be a Contact ID later

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const message = new Message('4', subject, msgText, this.currentSender);

    this.addMessageEvent.emit(message);

    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
