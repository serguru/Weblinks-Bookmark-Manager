import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { PagesService } from './services/pages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { LOGIN } from './common/constants';
import { PageModel } from './models/PageModel';
import { AccountModel } from './models/AccountModel';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Links 3';

  isPageRoute: boolean = false;

  constructor(
    public pagesService: PagesService,
    private router: Router,
    public loginService: LoginService
  ) { }

  ngOnInit(): void {

    if (this.loginService.isAuthenticated) {
      this.pagesService.getAccount().subscribe((account: AccountModel) => {
        const pages = account.pages || [];
        if (pages.length) {
          const s = this.pagesService.activePage?.pagePath.toLowerCase();
          const p = pages.find(x => x.pagePath.toLowerCase() === s);
          if (p) {
            this.pagesService.activePage = p;
            return;
          }
          this.pagesService.activePage = pages[0];
          return;
        }
        this.pagesService.activePage = null;
      });
    }

    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      this.isPageRoute = this.router.url?.toLowerCase().startsWith('/page');
    });

  }

  logOut(): void {
    this.loginService.logout();
    this.pagesService.clearPages();
    this.router.navigate([LOGIN]);
  }


}
