import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  maxContactId = 0;

  contactListChangedEvent = new Subject<Contact[]>();

  private contactsUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  sortAndSend(): void {
    this.contacts.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts(): void {
    this.http
      .get<{ message: string; contacts: Contact[] }>(this.contactsUrl)
      .subscribe({
        next: (response) => {
          this.contacts = response.contacts ? response.contacts : [];
          this.maxContactId = this.getMaxId();
          this.sortAndSend();
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  addContact(contact: Contact): void {
    if (!contact) {
      return;
    }

    contact.id = '';

    const payload = {
      ...contact,
      group: contact.group
        ? contact.group.map((c) => (c as Contact & { _id?: string })._id ?? c.id)
        : []
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; contact: Contact }>(this.contactsUrl, payload, {
        headers
      })
      .subscribe({
        next: (responseData) => {
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    (newContact as Contact & { _id?: string })._id = (
      originalContact as Contact & { _id?: string }
    )._id;

    const payload = {
      ...newContact,
      group: newContact.group
        ? newContact.group.map(
            (c) => (c as Contact & { _id?: string })._id ?? c.id
          )
        : []
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.contactsUrl + '/' + originalContact.id, payload, {
        headers
      })
      .subscribe({
        next: () => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
  }

  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === contact.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.contactsUrl + '/' + contact.id).subscribe({
      next: () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }
}
