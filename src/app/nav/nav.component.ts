import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchBarVisible = false;
  allProducts: Product[] = [];
  searchResults: Product[] = [];

  constructor(private router: Router, private productService: ProductService) {
    // Close the menu on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  ngOnInit(){
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

  closeDropdown(id: string) {
    const dropdown = document.getElementById(id);
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
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
}
