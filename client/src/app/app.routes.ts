import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PageComponent } from './components/page/page.component';
import { AddPageComponent } from './components/add-page/add-page.component';
import { UpdatePageComponent } from './components/update-page/update-page.component';
import { AddRowComponent } from './components/add-row/add-row.component';
import { UpdateRowComponent } from './components/update-row/update-row.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'page',
    pathMatch: 'full'
  },
  {
    path: 'page',
    component: PageComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'page/:path',
    component: PageComponent,
    canActivate: [loginGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'add-page', component: AddPageComponent },
  { path: 'update-page', component: UpdatePageComponent },
  { path: 'update-page/:path', component: UpdatePageComponent },
  { path: 'add-row', component: AddRowComponent },
  { path: 'update-row/:rowId', component: UpdateRowComponent },
  { path: '**', component: NotFoundComponent }
];

