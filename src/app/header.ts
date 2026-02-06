import { Component } from '@angular/core';
import { Dropdown } from './dropdown';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'cms-header',
  standalone: true,
  imports: [CommonModule, Dropdown, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

}
