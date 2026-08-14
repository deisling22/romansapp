import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class LoginComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: () => {
        this.isAuthenticated = true;
        this.cdr.markForCheck();
        this.router.navigate(['/account']);
      },
      error: () => {
        this.isAuthenticated = false;
        this.cdr.markForCheck();
      },
    });
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }
}