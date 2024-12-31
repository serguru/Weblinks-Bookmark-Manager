import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { PageModel } from './models/PageModel';
import { PagesService } from './services/pages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, finalize } from 'rxjs';
import { LoginService } from './services/login.service';
import { PageMode } from './enums';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Links 3';
  activeRoute: string | null = null;
  readonly PAGE = '/page/';
  readonly LOGIN = '/login';
  public PageMode = PageMode;

  constructor(private pagesService: PagesService, private router: Router, public loginService: LoginService) { }

  get pages(): PageModel[] {
    return this.pagesService.pages;
  }

  get selectedPage(): PageModel | null {
    return this.pagesService.selectedPage;
  }

  get isPageRoute(): boolean {
    return this.activeRoute === '/' || !!this.activeRoute?.toLowerCase().startsWith(this.PAGE);
  }
  get isLoginRoute(): boolean {
    return this.activeRoute?.toLowerCase() === this.LOGIN;
  }
  get activePagePath(): string {
    const s = this.activeRoute?.toLowerCase() || '';
    return s.startsWith(this.PAGE) ? s.substring(this.PAGE.length) : '';
  }

  subscribeToNavigationEnd(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = this.router.url;
      if (this.isPageRoute) {
        this.pagesService.setSelectedPageByPath(this.activePagePath);
        return;
      }
      if (this.isLoginRoute && this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    if (!this.loginService.isAuthenticated) {
      // will be redirected to login page by the guard
      return;
    }
    this.pagesService.getPages()
      .pipe(
        finalize(() => {
          this.subscribeToNavigationEnd();
        })
      )
      .subscribe();
  }

  logOut(): void {
    this.loginService.logout();
    this.pagesService.clearAll();
    this.router.navigate(['/login']);
  }

  addPage(): void {
    this.pagesService.updatePageMode(PageMode.Add);
  }

}
