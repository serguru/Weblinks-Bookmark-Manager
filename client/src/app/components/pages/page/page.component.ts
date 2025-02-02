import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RowComponent } from '../../rows/row/row.component';
import { PagesService } from '../../../services/pages.service';
import { LoginService } from '../../../services/login.service';
import { DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { LrowModel } from '../../../models/LrowModel';
import { MatIconModule } from '@angular/material/icon';
import { PageModel } from '../../../models/PageModel';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    RowComponent,
    MatButtonModule,
    DragDropModule,
    MatIconModule
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  constructor(public pagesService: PagesService,
    public loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private messagesService: MessagesService
  ) { }

  drop(event: CdkDragDrop<any>) {
    const p = this.pagesService.activePage;
    if (!p) {
      return;
    }
    if (p.readOnly) {
      this.messagesService.showPageReadOnly(p);
      return;
    }
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
