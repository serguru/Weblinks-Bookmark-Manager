import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowComponent } from '../row/row.component';
import { PagesService } from '../../services/pages.service';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    RowComponent,
    RouterLinkActive,
    MatButtonModule
],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  constructor(public pagesService: PagesService, public loginService: LoginService) {}

  ngOnInit(): void {
  }

}
