import { Component, OnInit } from '@angular/core';
import {  NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { PageModel } from './models/PageModel';
import { PagesService } from './services/pages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, 
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule, RouterLinkActive ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Links 3';
  pages: PageModel[] = [];
  selectedPage: PageModel | null = null;
  activeRoute: string | null = null;
  readonly PAGE = '/page/';

  get isPageRoute(): boolean {
    return this.activeRoute === '/' || !!this.activeRoute?.toLowerCase().startsWith(this.PAGE);
  }
  get activePagePath(): string {
    const s = this.activeRoute?.toLowerCase() || '';
    return s.startsWith(this.PAGE) ? s.substring(6) : '';
  }
  get showPagesInMenu(): boolean {
    const s = this.activeRoute?.toLowerCase() || '';
    return !s || s.startsWith(this.PAGE) || s === '/';
  }

  constructor(private pagesService: PagesService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = this.router.url;
      if (this.isPageRoute) {
        this.pagesService.setSelectedPageByPath(this.pages, this.activePagePath);
      }
    });

    this.pagesService.pages$.subscribe(x => {
      this.pages = x;
      if (this.isPageRoute) {
        this.pagesService.setSelectedPageByPath(this.pages, this.activePagePath);
      }
    });
    this.pagesService.selectedPage$.subscribe(x => {
      this.selectedPage = x;
    });
  }

}


