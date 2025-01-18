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

@Component({
  selector: 'app-register-account',
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
  templateUrl: './register-account.component.html',
  styleUrl: './register-account.component.css'
})
export class RegisterAccountComponent implements OnInit {
  registrationForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9-_]+$')
      ]],
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: this.loginService.passwordMatchValidator });
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
    this.route.params.subscribe(params => {
      if (this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    if (!this.registrationForm.valid) {
      return;
    }

    const account = {
      id: 0,
      userName: this.registrationForm.get("userName")!.value,
      userEmail: this.registrationForm.get("userEmail")!.value,
      firstName: this.registrationForm.get("firstName")!.value,
      lastName: this.registrationForm.get("lastName")!.value,
      settings: this.registrationForm.get("password")!.value,
      pages: []
    }

    this.loginService.register(account)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.messagesService.showSuccess('Registration was successful! Now please log in.')
        },
      });
  }
}