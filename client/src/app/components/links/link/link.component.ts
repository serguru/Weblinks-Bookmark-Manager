import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LinkModel } from '../../../models/LinkModel';

@Component({
  selector: 'app-link',
  imports: [CommonModule],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css'
})
export class LinkComponent {
  @Input() link: LinkModel | null = null;

}
