import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { PageFormComponent } from '../page-form/page-form.component';

@Component({
  selector: 'app-update-page',
  imports: [PageFormComponent],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css'
})
export class UpdatePageComponent implements OnInit {

  pagePath: string = '';

  constructor(public pagesService: PagesService) {


  }

  ngOnInit(): void {
    this.pagePath = this.pagesService.getParam('/update-page/', this.pagesService.activeRoute);
    // exiistence of a page with pagePath is checked in the service
  }
}
