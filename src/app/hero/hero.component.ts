import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'] // Ensure this is "styleUrls" (plural)
})
export class HeroComponent {
  isHomePage: boolean = false;
  backgroundImage: string = '../../assets/hero.webp';
  heroHeight: string = '70vh';
  page_title: string = 'Limited Hype';

  constructor(private router: Router, private renderer: Renderer2) {
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
      switch (url) {
        case '/nike':
          this.backgroundImage = 'assets/nike-hero.jpg';
          this.page_title = 'Nike';
          this.heroHeight = '30vh';
          break;
        case '/jordan':
          this.backgroundImage = 'assets/jordan-hero.jpg';
          this.page_title = 'Jordan';
          this.heroHeight = '30vh';
          break;
        case '/yeezy':
          this.backgroundImage = 'assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy';
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
        case '/nike/all':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'All Nikes';
          this.heroHeight = '30vh';
          break;
        case '/nike/sb':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Nike SB';
          this.heroHeight = '30vh';
          break;
        case '/nike/supreme':
          this.backgroundImage = 'assets/hero.webp';
          this.page_title = 'Supreme';
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
