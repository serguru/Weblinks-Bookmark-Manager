import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MessagesService } from '../../../services/messages.service';
import { ValidationErrorsComponent } from '../../base/validation-errors/validation-errors.component';

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
    MatCheckboxModule,
    ValidationErrorsComponent
  ],
  templateUrl: './page-form.component.html',
  styleUrl: './page-form.component.css'
})
export class PageFormComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  pageModel!: PageModel;
  
  @ViewChild('focusInput', { static: false }) focusInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
  ) {
    this.form = this.fb.group({
      pagePath: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9-_]+$')
      ]],
      caption: [''],
      pageDescription: ['']
    });
  }

  ngAfterViewInit() {
    if (!this.focusInput) {
      return;
    }
    setTimeout(() => {
      this.focusInput.nativeElement.focus();
    })
  }
    

  pagePathMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Page Path is required"
    },
    {
      key: "minlength",
      value: "Page Path must be at least 3 characters long"
    },
    {
      key: "maxlength",
      value: "Page Path cannot be more than 50 characters long"
    },
    {
      key: "pattern",
      value: "Page Path can only contain letters, numbers, hyphens, and underscores"
    },
  ];

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

        if (pm.isReadOnly) {
          this.messagesService.showPageReadOnly(pm);
          this.router.navigate(['/page/' + pm.pagePath]);
          return;
        }

        this.pageModel = pm;
        this.form.get('pagePath')!.setValue(this.pageModel.pagePath);
        this.form.get('caption')!.setValue(this.pageModel.caption);
        this.form.get('pageDescription')!.setValue(this.pageModel.pageDescription);

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

    const page: any = {
      id: this.pageModel?.id || 0,
      pagePath: this.form.get("pagePath")!.value,
      caption: this.form.get("caption")!.value,
      isReadOnly: this.pageModel?.isReadOnly || false,
      isPublic: this.pageModel?.isPublic || false,
      pageDescription: this.form.get("pageDescription")!.value,
    };

    this.pagesService.addOrUpdatePage(page)
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