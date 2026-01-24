import { Contact } from '../contact.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'cms-contact-item',
  imports: [],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;

  @Output() selected = new EventEmitter<Contact>();

  onSelected() {
    this.selected.emit(this.contact);
  }
}
