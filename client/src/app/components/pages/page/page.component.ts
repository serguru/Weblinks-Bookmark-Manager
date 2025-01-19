import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RowComponent } from '../../rows/row/row.component';
import { PagesService } from '../../../services/pages.service';
import { LoginService } from '../../../services/login.service';
import {DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { LrowModel } from '../../../models/LrowModel';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    RowComponent,
    MatButtonModule,
    DragDropModule
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  constructor(public pagesService: PagesService, 
    public loginService: LoginService,
    private router: Router, 
    private route: ActivatedRoute
  
  ) { }

    drop(event: CdkDragDrop<LrowModel[]>) {
      moveItemInArray(this.pagesService.activePage?.lrows || [], event.previousIndex, event.currentIndex);
      this.pagesService.saveConfig();
    }

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
        return;
      }

      // setTimeout is used here to avoid "... changed after checked ... " error
      setTimeout(() => {
        this.pagesService.updateActivePage(page);
      })
    });
  }



}
