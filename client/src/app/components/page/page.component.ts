import { Component, Input } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { ActivatedRoute } from '@angular/router';
import { PageModel } from '../../models/PageModel';
import { PageMode } from '../../enums';

@Component({
  selector: 'app-page',
  imports: [],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  @Input() selectedPage: PageModel | null = null;
  @Input() pageMode: PageMode | null = null;
  

}
