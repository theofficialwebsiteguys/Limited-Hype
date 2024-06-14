import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, StripeElements, StripeAddressElement, StripeAddressElementOptions } from '@stripe/stripe-js';
import { PaymentService } from '../payment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: any[] = [];
  stripe: any;
  elements: StripeElements | undefined;
  addressElement: StripeAddressElement | undefined;
  checkoutSession: any;  // Add this line

  selectedCurrency = 'usd';
  address: any;

  @ViewChild('checkoutElement', { static: true }) checkoutElement!: ElementRef;

  constructor(private router: Router, private paymentService: PaymentService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cart = navigation.extras.state['cart'];
    }

  }

  async ngOnInit(): Promise<void> {
    if (!this.cart.length) {
      this.router.navigate(['/cart']);
    }

    this.stripe = await loadStripe('pk_test_51POOsRAtSJLPfYWYi6NnxCtQ1hBBJwgdLm6Mh8ARbkWDsSvI0naQxwMYRRPKxoPKRel3Jx22ovNHywU2AagBD1sB00Ueys9YAE');

    const options: StripeAddressElementOptions = {
      mode: 'shipping',
      fields: {
        phone: 'auto',
      },
    };

    this.elements = this.stripe.elements();
    this.addressElement = this.elements?.create('address', options);
    this.addressElement?.mount('#address-element');
  }

  ngOnDestroy(): void {
    if (this.addressElement) {
      this.addressElement.destroy();
    }

    // Destroy the checkout session if it exists
    if (this.checkoutSession) {
      this.checkoutSession.destroy();
    }
  }

  async initialize() {
    if (!this.elements || !this.addressElement) return;

    // Destroy the existing embedded checkout session if it exists
    if (this.checkoutSession) {
      this.checkoutSession.destroy();
    }

    const { value: address } = await this.addressElement.getValue();
    this.address = address;

    const lineItems = this.cart.map((cartItem: any) => {
      const variant = cartItem.variant.find((variant: any) => variant.size === cartItem.size || !variant.size);
      const itemName = cartItem.name;
      const price = variant ? variant.price : cartItem.variant[0].price;
      const quantity = cartItem.quantity;
      const category = cartItem.category;
      const product_id = variant.originalVariantProductId || cartItem.originalId;
      // const product_id = cartItem;
      return { name: itemName, price: (price * 100), quantity: quantity, category: category, product_id: product_id  };
    });

    const response = await this.paymentService.createCheckoutSession(lineItems, this.selectedCurrency, this.address).toPromise();
    const clientSecret = response?.clientSecret;

    if (this.stripe) {
      // Create a new checkout session and store it
      this.checkoutSession = await this.stripe.initEmbeddedCheckout({
        clientSecret,
      });
      this.checkoutSession.mount('#checkout');
    }
  }

  onCurrencyChange() {
    this.initialize();
  }
}
