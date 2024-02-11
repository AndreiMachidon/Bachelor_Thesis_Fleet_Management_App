import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../dto/Admin';
import { UserDto } from '../dto/UserDto';
import { SignUpDto } from '../dto/SignUpDto';
import { API_URL } from 'src/app/contants';
import { Observable } from 'rxjs';
import { SignInDto } from '../dto/SignInDto';
import jwtDecode from 'jwt-decode';
import { DecodedTokenAdmin } from '../dto/DecodedTokenAdmin';
import { Driver } from '../dto/Driver';
import { DecodedTokenDriver } from '../dto/DecodedTokenDriver';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  public login(signInDto: SignInDto) : Observable<UserDto>{
    return this.http.post<UserDto>(`${API_URL}/login`, signInDto);
  }

  public register(signUpDto: SignUpDto): Observable<UserDto> {
     return this.http.post<UserDto>(`${API_URL}/register/admin`, signUpDto);
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

  getUserDetails(): Admin | Driver	{
    const token = this.getAuthToken();

    if (token) {
      const decodedToken : DecodedTokenAdmin = jwtDecode(token);

      if(decodedToken.role === 'admin'){
          const admin: Admin = {
            id: decodedToken.id,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            phoneNumber: decodedToken.phoneNumber,
            email: decodedToken.email,
            role: decodedToken.role,
            imageData: decodedToken.imageData,
            organisationName: decodedToken.organisationName
          }
          
          return admin;

      }else{
          const decodedTokenDriver: DecodedTokenDriver = jwtDecode(token)
          const driver: Driver = {
            id: decodedTokenDriver.id,
            firstName: decodedTokenDriver.firstName,
            lastName: decodedTokenDriver.lastName,
            phoneNumber: decodedTokenDriver.phoneNumber,
            email: decodedTokenDriver.email,
            role: decodedTokenDriver.role,
            imageData: decodedTokenDriver.imageData,
            ratePerKilometer: decodedTokenDriver.ratePerKilometer,
            licenseExpiryDate: decodedTokenDriver.licenseExpiryDate,
            yearsOfExperience: decodedTokenDriver.yearsOfExperience,
            totalKilometersDriven: decodedTokenDriver.totalKilometersDriven ,
            organisationName: decodedTokenDriver.organisationName       
          }

          return driver;
      }
    } else {
      return null;
    }
  }
}
