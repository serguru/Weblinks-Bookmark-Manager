import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [loginGuard] }, // Default route
    { path: 'login', component: LoginComponent }
  ];