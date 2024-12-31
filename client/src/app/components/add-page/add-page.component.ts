import { Component, } from '@angular/core';
import { PageMode } from '../../enums';
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

  get cancelDisabled(): boolean {
    return this.pagesService.pages?.length === 0;
  }

  cancel() {
    if (this.cancelDisabled) {
      return;
    }
    
    this.pagesService.updatePageMode(PageMode.Browse);
    if (!this.pagesService.selectedPage) {
      this.router.navigate(['/']);
    }
  }

}