import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RowComponent } from '../../rows/row/row.component';
import { PagesService } from '../../../services/pages.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    RowComponent,
    MatButtonModule,
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const path = params['path'];

      if (!path) {
        if (this.pagesService.pages?.length) {
          if (this.pagesService.activePage) {
            this.router.navigate(['/page/' + this.pagesService.activePage.pagePath]);
            return;
          }
          this.pagesService.updateActivePage(this.pagesService.pages[0]);
          this.router.navigate(['/page/' + this.pagesService.pages[0].pagePath]);
        }
        this.pagesService.updateActivePage(null);
        return;
      }

      const page = this.pagesService.findPage(path);
      if (!page) {
        this.pagesService.updateActivePage(null);
        this.router.navigate(['/not-found']);
        return;
      }

      setTimeout(() => {
        this.pagesService.updateActivePage(page);
      })
    });
  }



}
