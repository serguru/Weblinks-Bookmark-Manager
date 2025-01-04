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
import { LcolumnModel } from '../../../models/LcolumnModel';
import {MatCardModule} from '@angular/material/card';
import { LinkComponent } from '../../links/link/link.component';


@Component({
  selector: 'app-column',
  imports: [
    CommonModule, 
    LinkComponent,
    RouterModule,
    MatButtonModule,
    CdkMenu,
    CdkMenuItem,
    CdkContextMenuTrigger,
    MatCardModule
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent {
  @Input() row!: LrowModel;
  @Input() column!: LcolumnModel;

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, private dialog: MatDialog) { }


  delete(): void {

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
