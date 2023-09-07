import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http'
import { Observable } from 'rxjs';
import { API_URL } from '../contants';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  
  constructor(private http: HttpClient) { }

  public getGreetings(): Observable<string> {
    return this.http.get(API_URL! + '/greeting', {responseType: 'text'})
  }

}
