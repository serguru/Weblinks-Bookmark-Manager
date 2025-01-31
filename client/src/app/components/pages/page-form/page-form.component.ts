import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { concatMap, filter, finalize, of } from 'rxjs';
import { PageModel } from '../../../models/PageModel';
import { PagesService } from '../../../services/pages.service';
import { LoginService } from '../../../services/login.service';
import { PAGE } from '../../../common/constants';
import { AccountModel } from '../../../models/AccountModel';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './page-form.component.html',
  styleUrl: './page-form.component.css'
})
export class PageFormComponent implements OnInit {
  form: FormGroup;

  pageModel!: PageModel;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      pagePath: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9-_]+$')
      ]],
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
        const path = params['path'];
        if (!path) {
          return;
        }
        const pm = this.pagesService.findPage(path);
        if (!pm) {
          this.router.navigate(['/not-found']);
          throw new Error('Page not found');
        }
        this.pageModel = pm;
        this.form.get('pagePath')!.setValue(this.pageModel.pagePath);
        this.form.get('caption')!.setValue(this.pageModel.caption);
      })
  }

  get isUpdateMode(): boolean {
    return !!this.pageModel;
  }

  get formTitle(): string {
    return this.isUpdateMode ? 'Update Page' : 'Add Page';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    const pagePath = this.form.get("pagePath")!.value;
    const caption = this.form.get("caption")!.value;
    const id = this.pageModel?.id || 0;
    this.pagesService.addOrUpdatePage(id, pagePath, caption)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe({
        next: (x: PageModel | null) => {
          if (!x) {
            return;
          }
          this.router.navigate([PAGE + x.pagePath]);
        }
      });
  }
}