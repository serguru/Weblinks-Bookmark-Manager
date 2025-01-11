import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { PagesService } from '../../../services/pages.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MessagesService } from '../../../services/messages.service';
import { ValidationErrorsComponent } from '../../base/validation-errors/validation-errors.component';
import { AccountModel } from '../../../models/AccountModel';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
    ValidationErrorsComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    public pagesService: PagesService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9-_]+$')
      ]],
      userEmail: ['', [Validators.required, Validators.email]],
    });
  }

  firstNameMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "First Name is required"
    },
  ]

  lastNameMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Last Name is required"
    },
  ]

  userNameMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Username is required"
    },
    {
      key: "minlength",
      value: "Username must be at least 3 characters long"
    },
    {
      key: "maxlength",
      value: "Username path cannot be more than 50 characters long"
    },
    {
      key: "pattern",
      value: "Username path can only contain letters, numbers, hyphens, and underscores"
    },
  ]

  emailMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Email is required"
    },
    {
      key: "userEmail",
      value: "Please enter a valid email address"
    },
  ]

  ngOnInit(): void {
    this.pagesService.account$.subscribe((account: AccountModel) => {
      this.form.get("userName")!.setValue(account?.userName || '');
      this.form.get("userEmail")!.setValue(account?.userEmail || '');
      this.form.get("firstName")!.setValue(account?.firstName || '');
      this.form.get("lastName")!.setValue(account?.lastName || '');
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;

    const account = {
      id: +this.loginService.accountId,
      userName: this.form.get("userName")!.value,
      userEmail: this.form.get("userEmail")!.value,
      firstName: this.form.get("firstName")!.value,
      lastName: this.form.get("lastName")!.value,
    }

    this.loginService.update(account)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messagesService.showSuccess('Update was successful')
        },
      });
  }
}