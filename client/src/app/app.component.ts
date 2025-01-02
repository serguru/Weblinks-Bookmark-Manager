import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { PagesService } from './services/pages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { LOGIN } from './common/constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Links 3';

  constructor(
    public pagesService: PagesService,
    private router: Router,
    public loginService: LoginService,
    private dialog: MatDialog
  ) { }

  logOut(): void {
    this.loginService.logout();
    this.pagesService.clearPages();
    this.router.navigate([LOGIN]);
  }

  deletePage(): void {

    const page = this.pagesService.activePage?.caption || this.pagesService.activePage?.pagePath;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Page',
        question: `Are you sure you want to delete page ${page}?`,
        yes: 'Yes',
        no: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.pagesService.deletePage(this.pagesService.activePage!.id).subscribe(() => {
        this.router.navigate(['/']);
      });
    });
  }


}
