import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  cartTotal: number = 0;
  
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cart = navigation.extras.state['cart'];
    }
  }


  ngOnInit(): void {
    if (!this.cart.length) {
      this.router.navigate(['/cart']);
    } else {
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.cartTotal = this.cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters
      return total + itemPrice;
    }, 0);
  }
}
