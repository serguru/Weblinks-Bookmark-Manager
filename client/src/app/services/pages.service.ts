import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageModel } from '../models/PageModel';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(private http: HttpClient) { }

  getPages(): Observable<PageModel[]> {
    return this.http.get<PageModel[]>(`${this.apiUrl}`);
  }
}
