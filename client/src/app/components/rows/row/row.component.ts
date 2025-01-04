import { Component, Input } from '@angular/core';
import { LrowModel } from '../../../models/LrowModel';
import { CommonModule } from '@angular/common';
import { PagesService } from '../../../services/pages.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { CdkMenuItem, CdkMenu, CdkContextMenuTrigger } from '@angular/cdk/menu';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../base/confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs';
import { ColumnComponent } from '../../columns/column/column.component';


@Component({
  selector: 'app-row',
  imports: [
    CommonModule, 
    ColumnComponent,
    RouterModule,
    MatButtonModule,
    CdkMenu,
    CdkMenuItem,
    CdkContextMenuTrigger
  ],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css'
})
export class RowComponent {
  @Input() row!: LrowModel;

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, private dialog: MatDialog) { }


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
