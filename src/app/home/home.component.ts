import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { FeaturedComponent } from '../featured/featured.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
