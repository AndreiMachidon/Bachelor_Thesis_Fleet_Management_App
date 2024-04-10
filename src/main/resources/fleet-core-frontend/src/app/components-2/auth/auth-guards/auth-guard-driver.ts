import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardDriver implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = this.authService.getAuthToken();
        if (token) {
            const now = Math.floor(Date.now() / 1000); 
            const decodedToken: any = jwt_decode(token);
            if (decodedToken.exp && decodedToken.exp < now) {
              this.router.navigate(['']);
              return false;
            }
            
            if (decodedToken.role === 'driver') {
                return true;
            }
        }

        this.router.navigate(['']);
        return false;
    }
}