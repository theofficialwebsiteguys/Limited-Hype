import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ProductService } from '../product.service';
import { Product } from '../models/product';

interface DropdownMenu {
    id: string;
    title: string;
    items: { link: string, label: string }[];
    active: boolean;
}

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
    mobileMenuActive = false;

    dropdownMenus: DropdownMenu[] = [
        {
            id: 'nikeDropdown',
            title: 'Nike',
            items: [
                { link: '/nike', label: 'View All' },
                { link: '/nike/air-force-1', label: 'Air Force 1' },
                { link: '/nike/air-max', label: 'Air Max' },
                { link: '/nike/dunk', label: 'Nike Dunk' },
                { link: '/nike/sb', label: 'Nike SB' },
                { link: '/nike/kobe', label: 'Kobe' }
            ],
            active: false
        },
        {
            id: 'jordanDropdown',
            title: 'Jordan',
            items: [
                { link: '/jordan', label: 'View All' },
                { link: '/jordan/jordan-1-low', label: 'Jordan 1 Low' },
                { link: '/jordan/jordan-1-mid', label: 'Jordan 1 Mid' },
                { link: '/jordan/jordan-1-high', label: 'Jordan 1 High' },
                { link: '/jordan/jordan-3', label: 'Jordan 3' },
                { link: '/jordan/jordan-4', label: 'Jordan 4' },
                { link: '/jordan/jordan-5', label: 'Jordan 5' },
                { link: '/jordan/jordan-11', label: 'Jordan 11' },
                { link: '/jordan/jordan-12', label: 'Jordan 12' }
            ],
            active: false
        },
        {
            id: 'yeezyDropdown',
            title: 'Yeezy',
            items: [
                { link: '/yeezy', label: 'View All' },
                { link: '/yeezy/slide', label: 'Yeezy Slide' },
                { link: '/yeezy/foam-rnnr', label: 'Yeezy Foam Rnnr' },
                { link: '/yeezy/350', label: 'Yeezy 350' },
                { link: '/yeezy/450', label: 'Yeezy 450' },
                { link: '/yeezy/500', label: 'Yeezy 500' },
                { link: '/yeezy/700', label: 'Yeezy 700' }
            ],
            active: false
        },
        {
            id: 'clothingDropdown',
            title: 'Clothing',
            items: [
                { link: '/clothing', label: 'View All' },
                { link: '/clothing/supreme', label: 'Supreme' },
                { link: '/clothing/essentials', label: 'Essentials' },
                { link: '/clothing/denim-tears', label: 'Denim Tears' },
                { link: '/clothing/bape', label: 'Bape' },
                { link: '/clothing/eric-emanuel', label: 'Eric Emanuel' },
                { link: '/clothing/hellstar', label: 'Hellstar' },
                { link: '/clothing/kaws', label: 'KAWS' },
                { link: '/clothing/pharaoh-collection', label: 'Pharaoh Collections' },
                { link: '/clothing/limited-hype', label: 'Limited Hype' },
                { link: '/clothing/sp5der', label: 'Sp5der' }
            ],
            active: false
        },
        {
            id: 'otherDropdown',
            title: 'Other',
            items: [
                { link: '/other', label: 'View All' },
                { link: '/other/used', label: 'Pre-Owned' },
                { link: '/other/new-balance', label: 'New Balance' },
                { link: '/other/crocs', label: 'Crocs' },
                { link: '/other/asics', label: 'Asics' },
            ],
            active: false
        }
    ];

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
        this.mobileMenuActive = false;
        this.dropdownMenus.forEach(menu => menu.active = false);
    }

    toggleMobileMenu() {
        this.mobileMenuActive = !this.mobileMenuActive;
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

    onSearchEnter(event: KeyboardEvent) {
      if (event.key === 'Enter') {
          const query = (event.target as HTMLInputElement).value;
          if (query) {
              this.router.navigate(['/search-results'], { queryParams: { query } });
              this.closeSearchBar();
          }
      }
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

    toggleDropdown(dropdownId: string) {
        const dropdownMenu = this.dropdownMenus.find(menu => menu.id === dropdownId);
        if (dropdownMenu) {
            dropdownMenu.active = !dropdownMenu.active;
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
