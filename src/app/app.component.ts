import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NikeComponent } from './nike/nike.component';
import { JordanComponent } from './jordan/jordan.component';
import { ProductService } from './product.service';
import { Observable, filter } from 'rxjs';
import { Product } from './models/product';
import { AuthService } from './auth.service';
import { SignupPopupComponent } from './signup-popup/signup-popup.component';
import { SearchResultsComponent } from './search-results/search-results.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    HttpClientModule,
    CommonModule, 
    NavComponent, 
    FooterComponent, 
    HomeComponent,
    NikeComponent, 
    JordanComponent, 
    RouterLink, 
    RouterLinkActive, 
    SignupPopupComponent, 
    SearchResultsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'limited-hype';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];

      if (code && state) {
        this.authService.handleCallback(code, state);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  login() {
    this.authService.authorize();
    console.log
  }
}
