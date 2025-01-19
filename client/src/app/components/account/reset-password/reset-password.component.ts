import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, KeyValue } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MessagesService } from '../../../services/messages.service';
import { ValidationErrorsComponent } from '../../base/validation-errors/validation-errors.component';



@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  token!: string; 

  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;


  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router, 
    private route: ActivatedRoute,
    private messagesService: MessagesService
  ) { 
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: this.loginService.passwordMatchValidator });
  }

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
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
  
    const password = this.form.get("password")!.value;

    this.loginService.resetPassword(this.token, password)
      .subscribe(
        () => {
          this.messagesService.showSuccess('Password successfully reset. Now please log in.')
          this.router.navigate(["/login"]);
        },
      );
  }

}
