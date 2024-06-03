import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [HeroComponent, CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  constructor(private router: Router) {
    // Close the menu on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  closeMenu() {
    const navbar = document.getElementById('navbarScroll');
    if (navbar && navbar.classList.contains('show')) {
      const navbarToggler = document.querySelector('.navbar-toggler');
      if (navbarToggler) {
        (navbarToggler as HTMLElement).click();
      }
    }
  }

  closeDropdown(id: string) {
    const dropdown = document.getElementById(id);
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
  
}
