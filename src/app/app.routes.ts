import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NikeComponent } from './nike/nike.component';
import { JordanComponent } from './jordan/jordan.component';
import { YeezyComponent } from './yeezy/yeezy.component';
import { ClothingComponent } from './clothing/clothing.component';
import { ShopComponent } from './shop/shop.component';
import { StoryComponent } from './story/story.component';
import { ItemDisplayComponent } from './item-display/item-display.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './success/success.component';
import { ContactComponent } from './contact/contact.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { OtherComponent } from './other/other.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirects to /home
    { path: 'home', component: HomeComponent},
    { path: 'nike', component: NikeComponent },
    { path: 'nike/sb', component: NikeComponent },
    { path: 'nike/dunk', component: NikeComponent },
    { path: 'nike/air-max', component: NikeComponent },
    { path: 'nike/air-force-1', component: NikeComponent },
    { path: 'nike/kobe', component: NikeComponent },
    { path: 'jordan', component: JordanComponent},
    { path: 'jordan/jordan-1-high', component: JordanComponent},
    { path: 'jordan/jordan-1-low', component: JordanComponent},
    { path: 'jordan/jordan-1-mid', component: JordanComponent},
    { path: 'jordan/jordan-3', component: JordanComponent},
    { path: 'jordan/jordan-4', component: JordanComponent},
    { path: 'jordan/jordan-5', component: JordanComponent},
    { path: 'jordan/jordan-11', component: JordanComponent},
    { path: 'jordan/jordan-12', component: JordanComponent},
    { path: 'yeezy', component: YeezyComponent},
    { path: 'yeezy/slide', component: YeezyComponent},
    { path: 'yeezy/foam-rnnr', component: YeezyComponent},
    { path: 'yeezy/350', component: YeezyComponent},
    { path: 'yeezy/450', component: YeezyComponent},
    { path: 'yeezy/500', component: YeezyComponent},
    { path: 'yeezy/700', component: YeezyComponent},
    { path: 'clothing', component: ClothingComponent},
    { path: 'clothing/supreme', component: ClothingComponent},
    { path: 'clothing/essentials', component: ClothingComponent},
    { path: 'clothing/denim-tears', component: ClothingComponent},
    { path: 'clothing/bape', component: ClothingComponent},
    { path: 'clothing/eric-emanuel', component: ClothingComponent},
    { path: 'clothing/hellstar', component: ClothingComponent},
    { path: 'clothing/pharaoh-collection', component: ClothingComponent},
    { path: 'clothing/limited-hype', component: ClothingComponent},
    { path: 'clothing/kaws', component: ClothingComponent},
    { path: 'other', component: OtherComponent},
    { path: 'other/used', component: OtherComponent},
    { path: 'other/new-balance', component: OtherComponent},
    { path: 'other/crocs', component: OtherComponent},
    { path: 'other/asics', component: OtherComponent},
    { path: 'shop', component: ShopComponent},
    { path: 'story', component: StoryComponent},
    { path: 'item/:id', component: ItemDisplayComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'search-results', component: SearchResultsComponent },
];
