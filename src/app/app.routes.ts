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

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirects to /home
    { path: 'home', component: HomeComponent},
    { path: 'nike/all', component: NikeComponent },
    { path: 'nike/sb', component: NikeComponent },
    { path: 'nike/supreme', component: NikeComponent },
    { path: 'jordan', component: JordanComponent},
    { path: 'yeezy', component: YeezyComponent},
    { path: 'clothing/essentials', component: ClothingComponent},
    { path: 'clothing/denim-tears', component: ClothingComponent},
    { path: 'clothing/bape', component: ClothingComponent},
    { path: 'clothing/eric-emanuel', component: ClothingComponent},
    { path: 'clothing/hellstar', component: ClothingComponent},
    { path: 'clothing/pharaoh-collection', component: ClothingComponent},
    { path: 'clothing/limited-hype', component: ClothingComponent},
    { path: 'shop', component: ShopComponent},
    { path: 'story', component: StoryComponent},
    { path: 'item/:id', component: ItemDisplayComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent }
];
