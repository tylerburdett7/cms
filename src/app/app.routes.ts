import { Routes } from '@angular/router';

import { Documents } from './documents/documents';
import { DocumentEdit } from './documents/document-edit/document-edit';
import { DocumentDetail } from './documents/document-detail/document-detail';

import { ContactsComponent } from './contacts/contacts';
import { ContactEdit } from './contacts/contact-edit/contact-edit';
import { ContactDetail } from './contacts/contact-detail/contact-detail';

import { MessageList } from './messages/message-list/message-list';

export const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },

  {
    path: 'documents',
    component: Documents,
    children: [
      { path: 'new', component: DocumentEdit },
      { path: ':id/edit', component: DocumentEdit },
      { path: ':id', component: DocumentDetail }
    ]
  },

  { path: 'messages', component: MessageList },

  {
    path: 'contacts',
    component: ContactsComponent,
    children: [
      { path: 'new', component: ContactEdit },
      { path: ':id/edit', component: ContactEdit },
      { path: ':id', component: ContactDetail }
    ]
  }
];
