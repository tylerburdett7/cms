import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header';
import { ContactsComponent } from './contacts/contacts';

@Component({
  selector: 'cms-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ContactsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cms');
}
