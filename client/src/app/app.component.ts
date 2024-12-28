import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Links 3';
  pages: PageModel[] = [];
  selectedPage: PageModel | null = null;
  activeRoute: string | null = null;
  get activePagePath(): string {
    const s = this.activeRoute?.toLowerCase() || '';
    return s.startsWith('/page/') ? s.substring(6) : '';
  }
  get showPagesInMenu(): boolean {
    const s = this.activeRoute?.toLowerCase() || '';
    return !s || s.startsWith('/page/') || s === '/';
  }

  constructor(private pagesService: PagesService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = this.router.url;
      this.pagesService.setSelectedPageByPath(this.pages, this.activePagePath);
    });

    this.pagesService.pages$.subscribe(x => {
      this.pages = x;
      this.pagesService.setSelectedPageByPath(this.pages, this.activePagePath);
    });
    this.pagesService.selectedPage$.subscribe(x => {
      this.selectedPage = x;
    });
  }

}


