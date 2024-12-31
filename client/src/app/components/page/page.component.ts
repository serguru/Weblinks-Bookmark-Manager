import { Component, Input, OnInit } from '@angular/core';
import { PageModel } from '../../models/PageModel';
import { PageMode } from '../../enums';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from "../not-found/not-found.component";
import { RowComponent } from '../row/row.component';
import { PagesService } from '../../services/pages.service';
import { AddPageComponent } from '../add-page/add-page.component';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    NotFoundComponent,
    RowComponent,
    AddPageComponent
],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {
  page: PageModel | null = null;
  pageMode: PageMode | null = null;
  public PageMode = PageMode;

  constructor(private pagesService: PagesService) {}

  ngOnInit(): void {
    this.pagesService.selectedPage$.subscribe(x => {
      this.page = x;
    });
    this.pagesService.pageMode$.subscribe(x => {
      this.pageMode = x;
    });
    this.pagesService.getPages().subscribe();
  }


}
