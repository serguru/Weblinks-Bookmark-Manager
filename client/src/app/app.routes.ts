import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PagesComponent } from './components/pages/pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'page/:path',
    component: PagesComponent,
    canActivate: [loginGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];