import { CommonModule } from '@angular/common';
import { Component, Renderer2, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'] // Ensure this is "styleUrls" (plural)
})
export class HeroComponent implements OnInit {
  isHomePage: boolean = false;
  backgroundImage: string = '../../assets/hero.webp';
  heroHeight: string = '70vh';
  page_title: string = 'Limited Hype';

  constructor(private router: Router, private route: ActivatedRoute, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.urlAfterRedirects);
      }
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.triggerAnimation();
      });
  }

  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.triggerAnimation();
  }

  checkRoute(url: string): void {
    if (url === '/' || url === '/home') {
      this.isHomePage = true;
      this.page_title = 'Limited Hype';
      this.heroHeight = '70vh';
    } else {
      this.isHomePage = false;
      const queryParams = this.route.snapshot.queryParams;
      const query = queryParams['query'];

      switch (url.split('?')[0]) {
        case '/nike':
          this.backgroundImage = 'assets/nike-hero.jpg';
          this.page_title = 'All Nike';
          this.heroHeight = '30vh';
          break;
        case '/jordan':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'All Jordan';
          this.heroHeight = '30vh';
          break;
        case '/jordan/jordan-1-high':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'Jordan 1 High';
          this.heroHeight = '30vh';
          break;
        case '/jordan/jordan-1-mid':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'Jordan 1 Mid';
          this.heroHeight = '30vh';
          break;
        case '/jordan/jordan-1-low':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'Jordan 1 Low';
          this.heroHeight = '30vh';
          break;
        case '/jordan/jordan-3':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'Jordan 3';
          this.heroHeight = '30vh';
          break;
        case '/jordan/jordan-11':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'Jordan 11';
          this.heroHeight = '30vh';
          break;
        case '/yeezy':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'All Yeezy';
          this.heroHeight = '30vh';
          break;
        case '/yeezy/slide':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy Slide';
          this.heroHeight = '30vh';
          break;
        case '/yeezy/foam-rnnr':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy Foam Rnnr';
          this.heroHeight = '30vh';
          break;
        case '/yeezy/350':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy 350';
          this.heroHeight = '30vh';
          break;
        case '/yeezy/450':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy 450';
          this.heroHeight = '30vh';
          break;
        case '/yeezy/500':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy 500';
          this.heroHeight = '30vh';
          break;
        case '/yeezy/700':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy 700';
          this.heroHeight = '30vh';
          break;
        case '/clothing':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'All Clothing';
          this.heroHeight = '30vh';
          break;
        case '/clothing/essentials':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Essentials';
          this.heroHeight = '30vh';
          break;
        case '/clothing/denim-tears':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Denim Tears';
          this.heroHeight = '30vh';
          break;
        case '/clothing/bape':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Bape';
          this.heroHeight = '30vh';
          break;
        case '/clothing/eric-emanuel':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Eric Emanuel';
          this.heroHeight = '30vh';
          break;
        case '/clothing/hellstar':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Hellstar';
          this.heroHeight = '30vh';
          break;
        case '/clothing/pharaoh-collection':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Pharaoh Collections';
          this.heroHeight = '30vh';
          break;
        case '/clothing/limited-hype':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'Limited Hype';
          this.heroHeight = '30vh';
          break;
        case '/clothing/kaws':
          this.backgroundImage = 'assets/clothing-hero.jpg';
          this.page_title = 'KAWS';
          this.heroHeight = '30vh';
          break;
        case '/story':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Our Story';
          this.heroHeight = '30vh';
          break;
        case '/shop':
          this.backgroundImage = 'assets/shop/1.JPG';
          this.page_title = 'The Shop';
          this.heroHeight = '30vh';
          break;
        case '/cart':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Cart';
          this.heroHeight = '30vh';
          break;
        case '/checkout':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Checkout';
          this.heroHeight = '30vh';
          break;
        case '/nike/sb':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Nike SB';
          this.heroHeight = '30vh';
          break;
        case '/nike/dunk':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Nike Dunk';
          this.heroHeight = '30vh';
          break;
        case '/nike/air-max':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Air Max';
          this.heroHeight = '30vh';
          break;
        case '/nike/air-force-1':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Air Force 1';
          this.heroHeight = '30vh';
          break;
        case '/nike/kobe':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Kobe';
          this.heroHeight = '30vh';
          break;
        case '/clothing/supreme':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Supreme';
          this.heroHeight = '30vh';
          break;
        case '/contact':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Contact';
          this.heroHeight = '30vh';
          break;
        case '/search-results':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = query ? `Search Results for "${query}"` : 'Search Results';
          this.heroHeight = '30vh';
          break;
        case '/other':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'All Others';
          this.heroHeight = '30vh';
          break;
        case '/other/used':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Pre Owned';
          this.heroHeight = '30vh';
          break;
        case '/other/new-balance':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'New Balance';
          this.heroHeight = '30vh';
          break;
        case '/other/crocs':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Crocs';
          this.heroHeight = '30vh';
          break;
        case '/other/asics':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Asics';
          this.heroHeight = '30vh';
          break;
        // Add more cases as needed
        default:
          this.backgroundImage = 'assets/hero.webp';
          this.heroHeight = '40vh';
      }
    }
  }

  triggerAnimation(): void {
    const element = document.querySelector('.page-title');
    if (element) {
      this.renderer.removeClass(element, 'fade-in-down');
      void (element as HTMLElement).offsetWidth; // Trigger reflow
      this.renderer.addClass(element, 'fade-in-down');
    }
  }

  onCanPlay(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    videoElement.play();
  }

  onLoadedMetadata(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    videoElement.muted = true;
  }
}
