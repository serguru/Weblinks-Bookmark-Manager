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
    debugger;
    this.getPages();
  }

  getPages(){
    this.pagesService.getPages().subscribe(x => {
      this.pages = x;
      if (!this.pages || this.pages.length === 0) {
        this.selectedPage = null;
        this.pageMode = PageMode.Add;
        return;
      }
      let path = this.route.snapshot.paramMap.get('path');
      if (!path) {
        this.selectedPage = this.pages[0];
        this.pageMode = PageMode.Browse;
        return;
      }
      path = path.toLowerCase();
      let page = this.pages.find(x => x.pagePath && x.pagePath.toLowerCase() === path) || null;
      if (!page) {
        this.selectedPage = null;
        this.pageMode = PageMode.NotFound;
        return;
      }
      this.selectedPage = page;      
      this.pageMode = PageMode.Browse;
    });
  }
}
