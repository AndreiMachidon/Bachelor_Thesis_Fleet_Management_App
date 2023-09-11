import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dto/UserDto';
import { SignUpDto } from '../dto/SignUpDto';
import { API_URL } from 'src/app/contants';
import { Observable } from 'rxjs';
import { SignInDto } from '../dto/SignInDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(signInDto: SignInDto) : Observable<UserDto>{
    return this.http.post<UserDto>(`${API_URL}/login`, signInDto);
  }

  public register(signUpDto: SignUpDto): Observable<UserDto> {
     return this.http.post<UserDto>(`${API_URL}/register`, signUpDto);
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null): void {
      if(token != null){
        window.localStorage.setItem("auth_token", token);
      }else{
        window.localStorage.removeItem("auth_token");
      }
  } 
}
