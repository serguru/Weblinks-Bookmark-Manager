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
import { finalize, of, tap } from 'rxjs';
import { LcolumnModel } from '../../../models/LcolumnModel';
import { MatCardModule } from '@angular/material/card';
import { LinkComponent } from '../../links/link/link.component';
import { ContextMenuComponent } from '../../base/context-menu/context-menu.component';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { LinkModel } from '../../../models/LinkModel';
import { MatIconModule } from '@angular/material/icon';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-column',
  imports: [
    CommonModule,
    LinkComponent,
    RouterModule,
    MatButtonModule,
    CdkContextMenuTrigger,
    MatCardModule,
    ContextMenuComponent,
    CdkMenuTrigger,
    DragDropModule,
    MatIconModule
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent {
  @Input() row!: LrowModel;
  @Input() column!: LcolumnModel;

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, private dialog: MatDialog,
    private messagesService: MessagesService) { }

  drop(e: CdkDragDrop<any>) {

    const page = this.pagesService.getPageByRowId(e.previousContainer.data.rowId)!;
    if (page.isReadOnly) {
      this.messagesService.showPageReadOnly(page);
      return;
    }

    const o = e.container === e.previousContainer ?
      of(null).pipe(
        tap(() => {
          moveItemInArray(this.column.links || [], e.previousIndex, e.currentIndex);
        })
      ) :
      this.pagesService.moveLinkToColumn(e.item.data, e.container.data).pipe(
        tap(() => {
          e.container.data.links.splice(e.currentIndex, 0, e.item.data);
          const indexToDelete = e.previousContainer.data.links.findIndex((x: any) => x === e.item.data);
          e.previousContainer.data.links.splice(indexToDelete, 1);
        })
      );

    o.subscribe((): void => {
      this.pagesService.saveConfig();
    })
  }

  delete(): void {

    const p = this.pagesService.getPageById(this.row.pageId)!;

    if (p.isReadOnly) {
      this.messagesService.showPageReadOnly(p);
      this.router.navigate(['/page/'+p.pagePath]);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Column',
        question: `Are you sure you want to delete this column?`,
        yes: 'Yes',
        no: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.pagesService.deleteColumn(this.row, this.column)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(() => {
        });
    });
  }




}
