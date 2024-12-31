import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PageComponent } from './components/page/page.component';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'page/:path',
    component: PageComponent,
    canActivate: [loginGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];

