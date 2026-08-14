import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AccountComponent implements OnInit {
  user: AuthenticatedUser | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Angular defaults components to OnPush-style change detection now, so a plain
    // property assignment inside an async subscribe callback needs an explicit
    // markForCheck() to make the view actually reflect the new value.
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.cdr.markForCheck();
      },
      error: () => {
        this.user = null;
        this.cdr.markForCheck();
      },
    });
  }
}