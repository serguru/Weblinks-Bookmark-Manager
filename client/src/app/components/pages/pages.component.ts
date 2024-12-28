import { Component, Input, OnInit } from '@angular/core';
import { PageModel } from '../../models/PageModel';
import { PagesService } from '../../services/pages.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageMode } from '../../enums';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-pages',
  imports: [CommonModule, PageComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit {
[x: string]: any;
  pages: PageModel[] = [];
  selectedPage: PageModel | null = null;
  pageMode: PageMode | null = null;

  constructor(private pagesService: PagesService, private route: ActivatedRoute) {}

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
    const path = (this.route.snapshot.paramMap.get('path') || "").toLowerCase();
    this.pagesService.getPages(path);
  }
}
