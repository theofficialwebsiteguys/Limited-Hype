import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  cartTotal = 0;

  stripe: any;
  card: any;

  lineItems: any[]= [];

  
  constructor(private router: Router, private paymentService: PaymentService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cart = navigation.extras.state['cart'];
    }
  }


  async ngOnInit(): Promise<void> {
    console.log(this.cart)
    if (!this.cart.length) {
      this.router.navigate(['/cart']);
    } else {
      this.calculateTotal();
    }

    console.log(this.cart)


    this.stripe = await loadStripe('pk_test_51POOsRAtSJLPfYWYi6NnxCtQ1hBBJwgdLm6Mh8ARbkWDsSvI0naQxwMYRRPKxoPKRel3Jx22ovNHywU2AagBD1sB00Ueys9YAE');
    this.initialize();
  }

  calculateTotal() {
    return this.cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.variant[0].price); // Remove any non-numeric characters
      return total + itemPrice;
    }, 0);
  }

  async initialize() {

    console.log(this.cart)

    this.cart.forEach((cartItem:any) => {
        const variant = cartItem.variant.find((variant: any) => variant.size === cartItem.size);
        console.log(variant)
        const itemName = cartItem.name;
        const price = variant ? variant.price : cartItem.variant[0].price;
        const quantity = 1;
        this.lineItems.push({name: itemName, price: price*100, quantity: quantity})
    });


    const fetchClientSecret = async () => {
      const response = await this.paymentService.createCheckoutSession(this.lineItems).toPromise();
      return response!.clientSecret;
    };

    const checkout = await this.stripe.initEmbeddedCheckout({
      fetchClientSecret,
    });

    // Mount Checkout
    checkout.mount('#checkout');
  }
}
