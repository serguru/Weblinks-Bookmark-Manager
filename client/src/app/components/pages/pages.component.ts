import { Component, Input, OnInit } from '@angular/core';
import { PageModel } from '../../models/PageModel';
import { PagesService } from '../../services/pages.service';
import { CommonModule } from '@angular/common';
import { PageMode } from '../../enums';
import { PageComponent } from '../page/page.component';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'app-pages',
  imports: [CommonModule, PageComponent, NotFoundComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit {
  pages: PageModel[] = [];
  selectedPage: PageModel | null = null;
  pageMode: PageMode | null = null;

  constructor(private pagesService: PagesService) {}

  ngOnInit(): void {
    this.pagesService.pages$.subscribe(x => {
      this.pages = x;
    });
    this.pagesService.selectedPage$.subscribe(x => {
      this.selectedPage = x;
    });
    this.pagesService.pageMode$.subscribe(x => {
      this.pageMode = x;
    });
    this.pagesService.getPages();
  }
}
