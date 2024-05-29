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
          this.backgroundImage = '../../assets/nike-hero.jpg';
          this.page_title = 'Nike';
          this.heroHeight = '40vh';
          break;
        case '/jordan':
          this.backgroundImage = '../../assets/jordan-hero.jpg';
          this.page_title = 'Jordan';
          this.heroHeight = '40vh';
          break;
        case '/yeezy':
          this.backgroundImage = '../../assets/yeezy-hero.jpg';
          this.page_title = 'Yeezy';
          this.heroHeight = '40vh';
          break;
        case '/clothing':
          this.backgroundImage = '../../assets/clothing-hero.jpg';
          this.page_title = 'Clothing';
          this.heroHeight = '40vh';
          break;
        case '/story':
          this.backgroundImage = '../../assets/hero.webp';
          this.page_title = 'Our Story';
          this.heroHeight = '40vh';
          break;
        case '/shop':
          this.backgroundImage = '../../assets/hero.webp';
          this.page_title = 'The Shop';
          this.heroHeight = '40vh';
          break;
        // Add more cases as needed
        default:
          this.backgroundImage = '../../assets/hero.webp';
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
}
