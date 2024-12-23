import { Component, Input, OnInit } from '@angular/core';
import { PageModel } from '../../models/PageModel';
import { PagesService } from '../../services/pages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @Input() pages: PageModel[] = [];
  selectedPsage: PageModel | null = null;

  constructor(private pagesService: PagesService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.pagesService.getPages().subscribe(x => {
      this.pages = x;
    });
  }
}
