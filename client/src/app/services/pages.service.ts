import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { PageMode } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(private http: HttpClient) { }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();
  updatePages(pages: PageModel[]) {
    this.pagesSubject.next(pages);
  }

  private pageModeSubject = new BehaviorSubject<any>(null);
  public pageMode$ = this.pageModeSubject.asObservable();
  updateSelectedPage(page: PageModel | null) {
    this.selectedPageSubject.next(page);
  }

  private selectedPageSubject = new BehaviorSubject<PageModel | null>(null);
  public selectedPage$ = this.selectedPageSubject.asObservable();
  updatePageMode(mode: PageMode) {
    this.pageModeSubject.next(mode);
  }

  setSelectedPageByPath(pages: PageModel[], path: string) {
    if (!pages || pages.length === 0) {
      this.updateSelectedPage(null)
      this.updatePageMode(PageMode.Add);
      return;
    }
    if (!path) {
      this.updateSelectedPage(pages[0])
      this.updatePageMode(PageMode.Browse);
      return;
    }
    path = path.toLowerCase();
    const page = pages.find(x => x.pagePath && x.pagePath.toLowerCase() === path) || null;
    if (!page) {
      this.updateSelectedPage(null)
      this.updatePageMode(PageMode.NotFound);
      return;
    }
    this.updateSelectedPage(page)
    this.updatePageMode(PageMode.Browse);
  }

  getPages() {
    this.http.get<PageModel[]>(`${this.apiUrl}`)
      .subscribe(pages => {
        this.updatePages(pages);
      });
  }
}
