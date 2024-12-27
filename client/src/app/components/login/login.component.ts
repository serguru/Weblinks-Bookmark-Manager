import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loginService.login(this.email, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }
}