import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, first, Observable, tap } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { PageMode } from '../enums';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(private http: HttpClient, private router: Router) { }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();
  updatePages(pages: PageModel[]) {
    this.pagesSubject.next(pages);
  }
  get pages(): PageModel[] {
    return this.pagesSubject.getValue();
  }

  private pageModeSubject = new BehaviorSubject<any>(null);
  public pageMode$ = this.pageModeSubject.asObservable();
  updateSelectedPage(page: PageModel | null) {
    this.selectedPageSubject.next(page);
  }
  get pageMode(): PageMode {
    return this.pageModeSubject.getValue();
  }

  private selectedPageSubject = new BehaviorSubject<PageModel | null>(null);
  public selectedPage$ = this.selectedPageSubject.asObservable();
  updatePageMode(mode: PageMode) {
    this.pageModeSubject.next(mode);
  }
  get selectedPage(): PageModel | null {
    return this.selectedPageSubject.getValue();
  }

  setSelectedPageByPath(path: string) {
    if (!this.pages || this.pages.length === 0) {
      this.updateSelectedPage(null)
      this.updatePageMode(PageMode.Add);
      return;
    }
    if (!path) {
        this.router.navigate(['/page', this.pages[0].pagePath]);
        return;
    }
    path = path.toLowerCase();
    const page = this.pages.find(x => x.pagePath && x.pagePath.toLowerCase() === path) || null;
    if (!page) {
      this.updateSelectedPage(null)
      this.updatePageMode(PageMode.NotFound);
      return;
    }
    this.updateSelectedPage(page)
    this.updatePageMode(PageMode.Browse);
  }

  getPages(): Observable<PageModel[]> {
    return this.http.get<PageModel[]>(this.apiUrl).pipe(
      tap((pages) => {
        this.updatePages(pages);
      })
    );
  }  
}
// .subscribe(pages => {
//   this.updatePages(pages);
// });
