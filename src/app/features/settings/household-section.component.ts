import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HouseholdApiService } from '../../core/household-api.service';
import { Household } from '../../core/models';

/** Shared household: invite code, join, members. Everything (plans, list, pantry, profile) belongs to it. */
@Component({
  selector: 'app-household-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="household" aria-labelledby="household-title">
      <p class="eyebrow">Gemeinsam planen</p>
      <h2 id="household-title">Haushalt</h2>
      @if (household(); as current) {
        @if (!current.authenticated) {
          <p>
            Ohne Anmeldung nutzt dieses Gerät {{ current.guest ? 'einen Gast-Haushalt' : 'den Standard-Haushalt' }}.
            <a routerLink="/login">Melde dich an</a>, um Pläne, Einkaufsliste und Vorrat mit deinem Haushalt zu teilen.
          </p>
        } @else {
          <p>
            Alle Mitglieder sehen dieselben Pläne, dieselbe Einkaufsliste, denselben Vorrat und dieselben Ausgaben.
          </p>
          <form class="row" (ngSubmit)="rename()">
            <input name="householdName" [(ngModel)]="name" maxlength="120" aria-label="Name des Haushalts" />
            <button type="submit" class="secondary" [disabled]="busy()">Umbenennen</button>
          </form>
          <ul class="members">
            @for (member of current.members; track member.email) {
              <li>
                <span>{{ member.email }}{{ member.you ? ' (du)' : '' }}</span>
                <small>{{ member.role === 'OWNER' ? 'Besitzer' : 'Mitglied' }}</small>
                @if (current.role === 'OWNER' && !member.you) {
                  <button type="button" class="secondary" (click)="remove(member.email)" [disabled]="busy()">Entfernen</button>
                }
              </li>
            }
          </ul>
          <div class="invite">
            @if (current.inviteCode) {
              <p>Einladungscode: <strong class="code" data-testid="invite-code">{{ current.inviteCode }}</strong></p>
            }
            <button type="button" class="secondary" (click)="invite()" [disabled]="busy()">
              {{ current.inviteCode ? 'Neuen Code erzeugen' : 'Mitglied einladen' }}
            </button>
          </div>
          <form class="row" (ngSubmit)="join()">
            <input name="inviteCode" [(ngModel)]="code" maxlength="16" placeholder="Code eingeben" aria-label="Einladungscode" autocapitalize="characters" />
            <button type="submit" [disabled]="busy() || !code.trim()">Beitreten</button>
          </form>
          <p class="hint">Beim Beitreten wechselst du in den anderen Haushalt; deine bisherigen Daten bleiben im alten Haushalt.</p>
          @if (current.defaultClaimable) {
            <button type="button" class="secondary" (click)="claim()" [disabled]="busy()">
              Daten von vor der Anmeldung übernehmen
            </button>
          }
          @if (current.members.length > 1) {
            <button type="button" class="secondary" (click)="leave()" [disabled]="busy()">Haushalt verlassen</button>
          }
        }
      }
      @if (error()) {
        <p class="field-error" role="alert">{{ error() }}</p>
      }
    </section>
  `,
  styles: `
    .household { margin-top: 1.5rem; display: grid; gap: 0.6rem; }
    .row { display: flex; gap: 0.5rem; }
    .row input { flex: 1; min-width: 0; }
    .members { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.4rem; }
    .members li { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .members span { flex: 1; overflow-wrap: anywhere; }
    .code { letter-spacing: 0.15em; font-size: 1.15rem; user-select: all; }
    .hint { font-size: 0.85rem; opacity: 0.75; margin: 0; }
  `,
})
export class HouseholdSectionComponent implements OnInit {
  readonly household = signal<Household | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  name = '';
  code = '';

  constructor(private readonly api: HouseholdApiService) {}

  ngOnInit(): void {
    this.api.getHousehold().subscribe({
      next: (household) => this.apply(household),
      error: () => this.error.set('Der Haushalt konnte nicht geladen werden.'),
    });
  }

  rename(): void {
    if (this.name.trim()) {
      this.run(this.api.rename(this.name.trim()));
    }
  }

  invite(): void {
    this.run(this.api.createInviteCode());
  }

  join(): void {
    if (confirm('Dem Haushalt beitreten? Du siehst danach dessen Pläne, Einkaufsliste und Vorrat.')) {
      this.run(this.api.join(this.code.trim()), true);
    }
  }

  claim(): void {
    this.run(this.api.claimDefault(), true);
  }

  leave(): void {
    if (confirm('Haushalt verlassen? Du startest mit einem leeren Haushalt.')) {
      this.run(this.api.leave(), true);
    }
  }

  remove(email: string): void {
    if (confirm(`${email} aus dem Haushalt entfernen?`)) {
      this.run(this.api.removeMember(email));
    }
  }

  private run(request: ReturnType<HouseholdApiService['getHousehold']>, reloadAfter = false): void {
    this.busy.set(true);
    this.error.set('');
    request.subscribe({
      next: (household) => {
        this.apply(household);
        this.busy.set(false);
        if (reloadAfter) {
          // Plans, list and pantry belong to the household, so start fresh with the new data.
          window.location.reload();
        }
      },
      error: (response) => {
        this.busy.set(false);
        this.error.set(response?.error?.detail || response?.error?.message || 'Das hat leider nicht geklappt.');
      },
    });
  }

  private apply(household: Household): void {
    this.household.set(household);
    this.name = household.name;
    this.code = '';
  }
}
