import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageModel } from '../models/PageModel';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private snackBar: MatSnackBar) { }

  showError(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showSuccess(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showWarning(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showPageReadOnly(page: PageModel) {
    const message: string = `Page ${page.caption} is read only`;
    this.showWarning(message);
  }
}
