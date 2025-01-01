import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-page',
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
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.css'
})
export class AddPageComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

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

  ngOnInit(): void { }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    const pagePath = this.form.get("pagePath")!.value;
    const caption = this.form.get("caption")!.value;
    this.pagesService.addPage(pagePath, caption)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (x: PageModel) => {
              this.router.navigate([PAGE + x.pagePath]);
        },
        error: (error) => {
          if (error.status === 409) {
            this.pagesService.showError(`Page with path ${pagePath}  already exists`);
            return;
          }
          this.pagesService.showError('Unknowm error. Please try again later.');
        }
      });
  }
}