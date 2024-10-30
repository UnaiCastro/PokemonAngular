import { Routes } from '@angular/router';
import { MainPageComponent } from './mainPage/main-page/main-page.component';
import { DetailsPageComponent } from './detailsPage/details-page/details-page.component';
import { LikesPageComponent } from './likes-page/likes-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'detail/:id', component: DetailsPageComponent },
  { path: 'likes', component: LikesPageComponent }
];




