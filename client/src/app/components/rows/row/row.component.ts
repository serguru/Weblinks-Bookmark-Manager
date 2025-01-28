import { Component, Input, ViewChild } from '@angular/core';
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
import { ColumnComponent } from '../../columns/column/column.component';
import { ContextMenuComponent } from '../../base/context-menu/context-menu.component';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { LcolumnModel } from '../../../models/LcolumnModel';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-row',
  imports: [
    CommonModule,
    ColumnComponent,
    RouterModule,
    MatButtonModule,
    CdkContextMenuTrigger,
    ContextMenuComponent,
    CdkMenuTrigger,
    DragDropModule,
    MatIconModule
  ],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css'
})
export class RowComponent {
  @Input() row!: LrowModel;

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, private dialog: MatDialog) { }

  @ViewChild('menuTrigger') menuTrigger!: CdkMenuTrigger;

  drop(e: CdkDragDrop<any>) {

    const o = e.container === e.previousContainer ?
      of(null).pipe(
        tap(() => {
          moveItemInArray(this.row.lcolumns || [], e.previousIndex, e.currentIndex);
        })
      ) :
      this.pagesService.moveColumnToRow(e.item.data, e.container.data).pipe(
        tap(() => {
          e.container.data.lcolumns.splice(e.currentIndex, 0, e.item.data);
          const indexToDelete = e.previousContainer.data.lcolumns.findIndex((x: any) => x === e.item.data);
          e.previousContainer.data.lcolumns.splice(indexToDelete, 1);
        })
      );

    o.subscribe((): void => {
      this.pagesService.saveConfig();
    })
  }


  openMenu() {
    this.menuTrigger.open();
  }

  delete(): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Row',
        question: `Are you sure you want to delete this row?`,
        yes: 'Yes',
        no: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.pagesService.deleteRow(this.row)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(() => {
        });
    });
  }




}
