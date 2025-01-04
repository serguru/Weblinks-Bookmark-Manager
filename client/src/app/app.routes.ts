import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { NotFoundComponent } from './components/base/not-found/not-found.component';
import { AddColumnComponent } from './components/columns/add-column/add-column.component';
import { UpdateColumnComponent } from './components/columns/update-column/update-column.component';
import { PageComponent } from './components/pages/page/page.component';
import { LoginComponent } from './components/base/login/login.component';
import { AddPageComponent } from './components/pages/add-page/add-page.component';
import { UpdatePageComponent } from './components/pages/update-page/update-page.component';
import { AddRowComponent } from './components/rows/add-row/add-row.component';
import { UpdateRowComponent } from './components/rows/update-row/update-row.component';

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
  { path: 'update-page/:path', component: UpdatePageComponent },
  { path: 'add-row', component: AddRowComponent },
  { path: 'update-row/:rowId', component: UpdateRowComponent },
  { path: 'add-column/:rowId', component: AddColumnComponent },
  { path: 'update-column/:rowId/:columnId', component: UpdateColumnComponent },
  { path: '**', component: NotFoundComponent }
];