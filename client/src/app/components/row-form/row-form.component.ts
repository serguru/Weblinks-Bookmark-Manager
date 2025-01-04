import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { PagesService } from '../../services/pages.service';
import { PAGE } from '../../common/constants';
import { PageModel } from '../../models/PageModel';
import { LrowModel } from '../../models/LrowModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-row-form',
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
  templateUrl: './row-form.component.html',
  styleUrl: './row-form.component.css'
})
export class RowFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  rowModel!: LrowModel;

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

    this.route.params.subscribe(params => {
      const rowId = params['rowId'];
      if (rowId) {
        const r = this.pagesService.getActivePageRow(rowId);
        if (!r) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.rowModel = r;
        this.form.get('caption')!.setValue(this.rowModel.caption);
      }
    });
  }

  get formTitle(): string {
    return this.rowModel ? 'Update Row' : 'Add Row';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    const caption = this.form.get("caption")!.value;
    const id = this.rowModel?.id || 0;
    const pageId = this.pagesService.activePage!.id;
    this.pagesService.addOrUpdateRow(id, pageId, caption)
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