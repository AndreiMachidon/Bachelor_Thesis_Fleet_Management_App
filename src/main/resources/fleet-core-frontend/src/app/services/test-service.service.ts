import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  url ="https://fleet-core-backend.azurewebsites.net";
  constructor(private http: HttpClient) { }

  public getGreetings(): Observable<string> {
    return this.http.get(this.url! + '/greeting', {responseType: 'text'})
  }

}
