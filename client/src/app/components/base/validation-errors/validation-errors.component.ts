import { CommonModule, KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, Form, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  imports: [
    CommonModule
  ],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.css'
})
export class ValidationErrorsComponent {

  constructor() {
  }
  @Input() control: AbstractControl | null = null;
  @Input() messages: KeyValue<string, string>[] | null = null;


  get errorShown(): boolean {
    return !!this.messages?.find(x => this.control?.touched && this.control?.hasError(x.key));
  }

}
