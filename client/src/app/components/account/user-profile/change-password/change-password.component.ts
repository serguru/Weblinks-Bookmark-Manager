
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
import { LoginService } from '../../../../services/login.service';
import { PagesService } from '../../../../services/pages.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MessagesService } from '../../../../services/messages.service';
import { ValidationErrorsComponent } from '../../../base/validation-errors/validation-errors.component';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  hideOldPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: this.loginService.passwordMatchValidator });
  }


  oldPasswordMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Password is required"
    }
  ]

  passwordMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Password is required"
    },
    {
      key: "minlength",
      value: "Password must be at least 8 characters long"
    },
  ]

  confirmPasswordMessages: KeyValue<string, string>[] = [
    {
      key: "passwordMismatch",
      value: "Passwords do not match"
    },
  ]

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;

    const passwords = {
      oldPassword: this.form.get("oldPassword")!.value,
      password: this.form.get("password")!.value,
    }

    this.loginService.changePassword(passwords)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        () => {
          this.messagesService.showSuccess('Password successfully changed. Now please log in.')
          this.loginService.logout();
        },
      );
  }
}