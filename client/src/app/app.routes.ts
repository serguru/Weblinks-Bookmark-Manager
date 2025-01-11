import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { NotFoundComponent } from './components/base/not-found/not-found.component';
import { PageComponent } from './components/pages/page/page.component';
import { LoginComponent } from './components/account/login/login.component';
import { PageFormComponent } from './components/pages/page-form/page-form.component';
import { RowFormComponent } from './components/rows/row-form/row-form.component';
import { ColumnFormComponent } from './components/columns/column-form/column-form.component';
import { LinkFormComponent } from './components/links/link-form/link-form.component';
import { UserProfileComponent } from './components/account/user-profile/user-profile.component';
import { RegisterAccountComponent } from './components/account/register-account/register-account.component';
import { AboutComponent } from './components/account/about/about.component';
import { ContactUsComponent } from './components/account/contact-us/contact-us.component';
import { HelpComponent } from './components/documents/help/help.component';
import { TermsComponent } from './components/documents/terms/terms.component';
import { PolicyComponent } from './components/documents/policy/policy.component';

export const routes: Routes = [
  {path: '', redirectTo: 'page', pathMatch: 'full'},
  {path: 'page', component: PageComponent, canActivate: [loginGuard]},
  {path: 'page/:path', component: PageComponent, canActivate: [loginGuard]},
  {path: 'login', component: LoginComponent},
  { path: 'add-page', component: PageFormComponent, canActivate: [loginGuard]},
  { path: 'update-page/:path', component: PageFormComponent, canActivate: [loginGuard]},
  { path: 'add-row/:pageId', component: RowFormComponent, canActivate: [loginGuard]},
  { path: 'update-row/:rowId', component: RowFormComponent, canActivate: [loginGuard]},
  { path: 'add-column/:rowId', component: ColumnFormComponent, canActivate: [loginGuard]},
  { path: 'update-column/:rowId/:columnId', component: ColumnFormComponent, canActivate: [loginGuard]},
  { path: 'add-link/:rowId/:columnId', component: LinkFormComponent, canActivate: [loginGuard]},
  { path: 'update-link/:rowId/:columnId/:linkId', component: LinkFormComponent, canActivate: [loginGuard]},
  { path: 'register', component: RegisterAccountComponent},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [loginGuard]},
  { path: 'help', component: HelpComponent},
  { path: 'about', component: AboutComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'contact-us', component: ContactUsComponent, canActivate: [loginGuard]},
  { path: '**', component: NotFoundComponent}
];