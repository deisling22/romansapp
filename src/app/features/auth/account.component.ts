import { Component, OnInit } from '@angular/core';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AccountComponent implements OnInit {
  user: AuthenticatedUser | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => (this.user = user));
  }
}