import { Component, Input } from '@angular/core';
import { LrowModel } from '../../models/LrowModel';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'app-row',
  imports: [CommonModule, ColumnComponent],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css'
})
export class RowComponent {
  @Input() row: LrowModel | null = null;



}
