import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-get-started',
  imports: [
    MatCardModule,
    RouterModule
  ],
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.css'
})
export class GetStartedComponent implements OnInit {

  
  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }

}
