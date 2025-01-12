import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { PagesService } from './services/pages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { LOGIN } from './common/constants';
import { PageModel } from './models/PageModel';
import { AccountModel } from './models/AccountModel';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { ContextMenuComponent } from './components/base/context-menu/context-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/base/confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule, CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule,
    CdkContextMenuTrigger,
    ContextMenuComponent,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  popupPage: PageModel | null = null;
  activeRoute: string = '';

  constructor(
    public pagesService: PagesService,
    private router: Router,
    public loginService: LoginService,
    private dialog: MatDialog,
    private cookieService: CookieService
     
  ) { }

  protected selectedTabIndex = 0;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pagesService.pages, event.previousIndex, event.currentIndex);
    this.pagesService.saveConfig();
  }

  isRouteName(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  ngOnInit(): void {

    this.cookieService.deleteAll();

    if (this.loginService.isAuthenticated) {
      this.pagesService.getAccount().subscribe((account: AccountModel) => {
        const pages = account.pages || [];
        if (pages.length) {

          if (this.isRouteName('/page/')) {
            const path = this.activeRoute.substring(6);
            if (path?.length) {
              const p = pages.find(x => x.pagePath.toLowerCase() === path);
              if (!p) {
                this.router.navigate(['/page']);
                return;
              }
              this.pagesService.updateActivePage(p);
              return;
            }
          }

          const s = this.pagesService.activePage?.pagePath.toLowerCase();
          const p = pages.find(x => x.pagePath.toLowerCase() === s);
          if (p) {
            this.pagesService.updateActivePage(p);
            return;
          }
          this.pagesService.updateActivePage(pages[0]);
          return;
        }
        this.pagesService.updateActivePage(null);
      });
    }

    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      this.activeRoute = this.router.url?.toLowerCase() || '';
    });

  }

  logOut(): void {
    this.loginService.logout();
  }

  onContextMenuOpened(page: PageModel): void {
    this.popupPage = page;
  }

  deletePopupPage(): void {

    if (!this.popupPage) {
      throw new Error('popupPage is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Page',
        question: `Are you sure you want to delete page ${this.popupPage.caption || this.popupPage.pagePath}?`,
        yes: 'Yes',
        no: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.popupPage = null;
        return;
      }
      this.pagesService.deletePage(this.popupPage!.id)
        .pipe(
          finalize(() => {
            this.popupPage = null;
          })
        )
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    });
  }

  get profileCaption(): string {
    if (!this.pagesService.account) {
      return "User Profile";
    }
    return this.pagesService.account.userName;
  }


}
