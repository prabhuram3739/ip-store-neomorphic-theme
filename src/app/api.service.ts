import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Package } from './package';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

const API_URL = environment.apiUrl;

@Injectable()
export class ApiService {

  /* invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription; */
  private options = { headers: new HttpHeaders().set('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict') };
  constructor(private http: HttpClient) {
  }

  // API: GET /data
  public getAllData(): Observable<HttpResponse<Package[]>> {
    return this.http.get<Package[]>(
      API_URL + '/data', { observe: 'response' });
  }

  // API: GET /data
  public getPlatformDetails(platformName: any): Observable<HttpResponse<Package[]>> {
    return this.http.get<Package[]>(
      API_URL + '/data/', { params: {
        platform: platformName,
        releaseName: platformName
      }, observe: 'response' });
  }

  /* onFirstComponentButtonClick() {
    this.invokeFirstComponentFunction.emit();
  } */

  // To format the workweek in the JSON to the date format to sort
  public formatDate(date: any, dateFormat: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (dateFormat === 'yyyy/mm/dd') {
      return [year, month, day].join('-');
    } else if (dateFormat === 'dd/mm/yyyy') {
      return [day, month, year].join('-');
    } else if (dateFormat === 'mm/dd/yyyy') {
      return [month, day, year].join('-');
    }
}
}
