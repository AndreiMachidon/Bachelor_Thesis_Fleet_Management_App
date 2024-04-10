import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'; // Import BreakpointState
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SignOutDialogComponent } from './dialogs/sign-out-dialog/sign-out-dialog.component';

interface MyBreakpointState extends BreakpointState {} // Define your own BreakpointState interface

@UntilDestroy()
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver, 
    private router: Router,
     private authService: AuthService,
     private dialog: MatDialog) {}
  

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res: MyBreakpointState) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  logout() {
    const dialogRef = this.dialog.open(SignOutDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'SignOut'){
        this.authService.signOut();
      }
    });
  }
  
}