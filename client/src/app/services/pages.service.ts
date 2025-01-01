import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, first, Observable, tap } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { NavigationEnd, Router } from '@angular/router';
import { LOGIN, PAGE } from '../common/constants';
import { LoginService } from './login.service';
import { isPageRoute, isPage_Route } from '../common/utils';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;
  private activeRoute: string | null = null;

  constructor(private http: HttpClient, private router: Router, 
    public loginService: LoginService, private snackBar: MatSnackBar) {
    if (!this.loginService.isAuthenticated) {
      this.subscribeToNavigationEnd();
      return;
    }
    this.getPages().subscribe(() => {
      this.subscribeToNavigationEnd();
    });
  }


  get isPageRoute(): boolean {
    return isPageRoute(this.activeRoute?.toLowerCase() || null);
  }

  subscribeToNavigationEnd() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = this.router.url;
      const ar = this.activeRoute?.toLowerCase();
      if (ar === LOGIN && this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
        return;
      }
      if (!isPageRoute(ar) && !isPage_Route(ar)) {
        return;
      }
      const ap = this.activePage;
      if (isPage_Route(ar) ) {
        if (ap) {
          this.router.navigate([PAGE + ap.pagePath]);
        } else {
          this.router.navigate(['/add-page']);
        }
        return;
      }
      if (!ap) {
        this.router.navigate(['/not-found']);
        return;
      }
    });
  }

  get activePage(): PageModel | null {
    if (!this.pages || this.pages.length === 0) {
      return null;
    }

    if (!this.activePagePath) { 
      return this.pages[0];
    }

    return this.pages?.find(p => p.pagePath.toLowerCase() === this.activePagePath) || null;
  }

  get activePagePath(): string {
    const s = this.activeRoute?.toLowerCase() || '';
    return s.startsWith(PAGE) ? s.substring(PAGE.length) : '';
  }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();
  updatePages(pages: PageModel[]) {
    this.pagesSubject.next(pages);
  }
  get pages(): PageModel[] {
    return this.pagesSubject.getValue();
  }

  getPages(): Observable<PageModel[]> {
    return this.http.get<PageModel[]>(this.apiUrl).pipe(
      tap((pages) => {
        this.updatePages(pages);
      })
    );
  }

  clearPages(): void {
    this.updatePages([]);
  }

  addPage(pagePath: string, caption: string): Observable<PageModel> {
    if (!this.loginService.isAuthenticated) { 
      throw new Error('Unauthorized');
    }

    return this.http.post(this.apiUrl + '/add-page', { pagePath: pagePath, caption: caption })
      .pipe(
        tap((response: any) => {
          const pages = this.pages || [];
          pages.push(response);
          this.updatePages(pages);
        })
      );
  }

  showError(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
