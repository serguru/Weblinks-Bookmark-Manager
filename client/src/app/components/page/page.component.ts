import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowComponent } from '../row/row.component';
import { PagesService } from '../../services/pages.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import {CdkContextMenuTrigger, CdkMenuItem, CdkMenu} from '@angular/cdk/menu';
import { PAGE } from '../../common/constants';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    RowComponent,
    MatButtonModule,
    CdkContextMenuTrigger, 
    CdkMenu, 
    CdkMenuItem
],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  constructor(public pagesService: PagesService, public loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
  }
  
  onContextMenuOpened(page: any): void {
    console.log('Context menu opened for page:', page);
  }

  onContextMenuClosed(): void {
    console.log('Context menu closed');
    // Handle the menu closed event here
  }

  navigateToPage(pagePath: string) {
    this.router.navigate([PAGE + pagePath]);
  }

}
