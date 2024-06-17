import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, StripeElements, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { PaymentService } from '../payment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var google: any;

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
  embeddedCheckout: StripeEmbeddedCheckout | undefined;
  selectedCurrency = 'usd';
  name = '';
  address = {
    line1: '',
    line2: '',
    city: '',
    country: 'US',
    postal_code: '',
    state: ''
  };

  loading = false;

  @ViewChildren('line1, line2, city, state, postal_code, country') addressInputs!: QueryList<ElementRef>;

  constructor(private router: Router, private paymentService: PaymentService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cart = navigation.extras.state['cart'];
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.cart.length) {
      this.router.navigate(['/cart']);
      return;
    }

    try {
      this.stripe = await loadStripe('pk_test_51POOsRAtSJLPfYWYi6NnxCtQ1hBBJwgdLm6Mh8ARbkWDsSvI0naQxwMYRRPKxoPKRel3Jx22ovNHywU2AagBD1sB00Ueys9YAE');
      if (!this.stripe) {
        console.error('Stripe failed to load.');
        return;
      }

      this.elements = this.stripe.elements();
      if (!this.elements) {
        console.error('Stripe elements failed to initialize.');
        return;
      }

      this.initializeGoogleMapsAutocompletes();
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }

  ngOnDestroy(): void {
    this.cleanupEmbeddedCheckout();
  }

  initializeGoogleMapsAutocompletes() {
    this.addressInputs.forEach(input => {
      const autocomplete = new google.maps.places.Autocomplete(input.nativeElement, {
        types: ['geocode'],
        componentRestrictions: { country: ['us', 'ca'] },
        fields: ['address_components', 'geometry']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          this.fillInAddress(place);
        }
      });
    });
  }

  fillInAddress(place: any) {
    const addressComponents = place.address_components;

    this.address = {
      line1: this.getComponent(addressComponents, 'street_number') + ' ' + this.getComponent(addressComponents, 'route'),
      line2: this.address.line2,
      city: this.getComponent(addressComponents, 'locality') || this.getComponent(addressComponents, 'sublocality'),
      state: this.getComponent(addressComponents, 'administrative_area_level_1'),
      postal_code: this.getComponent(addressComponents, 'postal_code'),
      country: this.getComponent(addressComponents, 'country')
    };
  }

  getComponent(components: any, type: string) {
    const component = components.find((component: any) => component.types.includes(type));
    return component ? component.long_name : '';
  }

  async initialize() {
    if (!this.elements) {
      console.error('Stripe elements are not initialized.');
      return;
    }

    // Cleanup the existing Embedded Checkout if it exists
    this.cleanupEmbeddedCheckout();

    this.loading = true;

    const lineItems = this.cart.map((cartItem: any) => {
      const variant = cartItem.variant.find((variant: any) => variant.size === cartItem.size || !variant.size);
      const itemName = cartItem.name;
      const price = variant ? variant.price : cartItem.variant[0].price;
      const quantity = cartItem.quantity;
      const category = cartItem.category;
      const product_id = variant.originalVariantProductId || cartItem.originalId;
      return { name: itemName, price: (price * 100), quantity: quantity, category: category, product_id: product_id };
    });

    const checkoutData = {
      name: this.name,
      address: this.address
    };

    try {
      const response = await this.paymentService.createCheckoutSession(lineItems, this.selectedCurrency, checkoutData).toPromise();
      const clientSecret = response?.clientSecret;

      if (this.stripe) {
        // Create a new Embedded Checkout instance
        this.embeddedCheckout = await this.stripe.initEmbeddedCheckout({
          clientSecret,
        });

        this.loading = false;
        
        setTimeout(() => {
          if (this.embeddedCheckout) {
            this.embeddedCheckout.mount('#checkout');
          }
        }, 0);
      }
    } catch (error) {
      console.error('Error initializing checkout:', error);
      this.loading = false;
    }
  }

  onCurrencyChange() {
    this.initialize();
  }

  cleanupEmbeddedCheckout() {
    if (this.embeddedCheckout) {
      this.embeddedCheckout.destroy();
      this.embeddedCheckout = undefined;
    }
  }
}
