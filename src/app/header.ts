import { Component } from '@angular/core';
import { Dropdown } from './dropdown';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';



@Component({
  selector: 'cms-header',
  standalone: true,
  imports: [CommonModule, Dropdown, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

}
