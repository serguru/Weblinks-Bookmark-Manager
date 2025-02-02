import { Component, Input } from '@angular/core';
import { LrowModel } from '../../../models/LrowModel';
import { CommonModule } from '@angular/common';
import { PagesService } from '../../../services/pages.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../base/confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs';
import { LcolumnModel } from '../../../models/LcolumnModel';
import {MatCardModule} from '@angular/material/card';
import { LinkModel } from '../../../models/LinkModel';
import { ContextMenuComponent } from '../../base/context-menu/context-menu.component';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-link',
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule,
    CdkContextMenuTrigger,
    MatCardModule,
    ContextMenuComponent
  ],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css'
})
export class LinkComponent {
  @Input() link!: LinkModel;
  @Input() row!: LrowModel;
  @Input() column!: LcolumnModel;

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, private dialog: MatDialog,
        private messagesService: MessagesService) { }

  delete(): void {

    const p = this.pagesService.getPageById(this.row.pageId)!;

    if (p.readOnly) {
      this.messagesService.showPageReadOnly(p);
      this.router.navigate(['/page/'+p.pagePath]);
      return;
    }


    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Link',
        question: `Are you sure you want to delete this link?`,
        yes: 'Yes',
        no: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.pagesService.deleteLink(this.column, this.link)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(() => {
      });
    });
  }




}
