import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ProductService } from '../product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [HeroComponent, CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchBarVisible = false;
  allProducts: Product[] = [];
  searchResults: Product[] = [];

  constructor(
    private router: Router, 
    private productService: ProductService,
    private renderer: Renderer2
  ) {
    // Close the menu on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  ngOnInit() {
    this.productService.getAllOrganizedProducts().subscribe(
      (products: Product[]) => {
        this.allProducts = products;
      },
      (error: any) => {
        console.error('Error fetching all products', error);
      }
    );
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

  toggleSearchBar() {
    this.closeMenu();
    this.searchBarVisible = !this.searchBarVisible;
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBarContainer.style.display = this.searchBarVisible ? 'block' : 'none';
      if (this.searchBarVisible) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 0);
      }
    }
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchResults = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  }

  viewProductDetail(product: any): void {
    this.searchBarVisible = false;
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBarContainer.style.display = 'none';
    }
    this.router.navigate(['/item', product.id], { state: { product } });
  }

  closeSearchBar() {
    this.searchBarVisible = false;
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBarContainer.style.display = 'none';
    }
  }

  handleDropdownClick(event: Event, dropdownId: string) {
    event.preventDefault();
    event.stopPropagation();
    const dropdownElement = document.getElementById(dropdownId);
    if (dropdownElement) {
      const isShown = dropdownElement.classList.contains('show');
      this.closeAllDropdowns();
      if (!isShown) {
        this.renderer.addClass(dropdownElement, 'show');
      }
    }
  }

  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      this.renderer.removeClass(dropdown, 'show');
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.isClickInsideElement(event, 'dropdown-toggle') && !this.isClickInsideElement(event, 'dropdown-menu')) {
      this.closeAllDropdowns();
    }
  }

  isClickInsideElement(event: Event, className: string): boolean {
    return (event.target as HTMLElement).closest(`.${className}`) !== null;
  }
}
