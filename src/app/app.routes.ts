import { Routes } from '@angular/router';
import { Documents } from './documents/documents';
import { ContactsComponent } from './contacts/contacts';

export const routes: Routes = [
  { path: 'documents', component: Documents },
  { path: 'contacts', component: ContactsComponent }
];
