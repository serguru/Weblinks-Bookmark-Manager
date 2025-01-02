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

@Component({
  selector: 'app-page-form',
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
  templateUrl: './page-form.component.html',
  styleUrl: './page-form.component.css'
})
export class PageFormComponent implements OnInit {
  @Input() pagePath: string | null = null;
  form: FormGroup;
  isLoading = false;

  pageModel!: PageModel;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService
  ) {
    this.form = this.fb.group({
      pagePath: ['', [Validators.required]],
      caption: ['']
    });
  }

  ngOnInit(): void { 
    if (this.pagePath) {
      const pm = this.pagesService.findPage(this.pagePath);
      if (!pm) {
        this.router.navigate(['/not-found']);
        return;
      }
      this.pageModel = pm;
      this.form.get('pagePath')!.setValue(this.pageModel.pagePath);
      this.form.get('caption')!.setValue(this.pageModel.caption);
    }
  }

  get formTitle(): string {
    return this.pagePath ? 'Update Page' : 'Add Page';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    const pagePath = this.form.get("pagePath")!.value;
    const caption = this.form.get("caption")!.value;
    const id = this.pageModel?.id || 0;
    this.pagesService.addOrUpdatePage(id, pagePath, caption)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (x: PageModel) => {
              this.router.navigate([PAGE + x.pagePath]);
        }
      });
  }
}