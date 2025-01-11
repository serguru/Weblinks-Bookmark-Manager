import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { concatMap, finalize, of } from 'rxjs';
import { PagesService } from '../../../services/pages.service';
import { LrowModel } from '../../../models/LrowModel';
import { ActivatedRoute } from '@angular/router';
import { LcolumnModel } from '../../../models/LcolumnModel';

@Component({
  selector: 'app-column-form',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './column-form.component.html',
  styleUrl: './column-form.component.css'
})
export class ColumnFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  rowModel!: LrowModel;
  columnModel: LcolumnModel | null = null;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      caption: ['']
    });
  }

  ngOnInit(): void {

    this.pagesService.account$
      .pipe(
        concatMap(account => {
          if (account) {
            return this.route.params;
          }
          return of();
        })
      )
      .subscribe(params => {
        if (!params) {
          return;
        }
        const rowId = params['rowId'];
        if (!rowId) {
          this.router.navigate(['not-found']);
          throw new Error('Row not found');
        }
        const r = this.pagesService.getRowById(+rowId);
        if (!r) {
          this.router.navigate(['not-found']);
          throw new Error('Active Page Row is required');
        }
        this.rowModel = r;
        const columnId = params['columnId'];
        if (!columnId) {
          return;
        }
        const c = r.lcolumns?.find(x => x.id === +columnId);
        if (!c) {
          this.router.navigate(['not-found']);
          throw new Error('Column not found');
        }
        this.columnModel = c;
        this.form.get('caption')!.setValue(this.columnModel.caption);
      })
  }

  get formTitle(): string {
    return this.columnModel ? 'Update Column' : 'Add Column';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    const caption = this.form.get("caption")!.value;
    const id = this.columnModel?.id || 0;
    this.pagesService.addOrUpdateColumn(this.rowModel, id, caption)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/page']);
        }
      );
  }
}