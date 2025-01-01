import { Component, } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-page',
  imports: [MatButtonModule],
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.css'
})
export class AddPageComponent {

  constructor(private pagesService: PagesService, private router: Router) { }



}