import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardRedirectExistingUser implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean {
        const token = this.authService.getAuthToken();
        if (token) {
            const now = Math.floor(Date.now() / 1000);
            const decodedToken: any = jwt_decode(token);
            if (decodedToken.exp && decodedToken.exp > now) {
                if (decodedToken.role === 'admin') {
                    this.router.navigate(['/admin-dashboard']);
                    return false;
                } else if (decodedToken.role === 'driver') {
                    this.router.navigate(['/driver-home']);
                    return false;
                }
            }
        }
        return true;
    }
}