import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginService } from '../../../services/login.service';
import { MessagesService } from '../../../services/messages.service';
import { ValidationErrorsComponent } from '../../base/validation-errors/validation-errors.component';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterModule,
    ValidationErrorsComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }


  emailMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Email is required"
    },
    {
      key: "email",
      value: "Please enter a valid email address"
    },
  ]


  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    const email = this.form.get("email")!.value;

    this.loginService.forgotPassword(email)
      .subscribe(() => {
        this.messagesService.showSuccess("A password recovery link will be sent to your email address");
      });
 }
}