import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OnboardingService } from '../../core/onboarding.service';

interface OnboardingStep {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-onboarding-tour',
  standalone: false,
  templateUrl: './onboarding-tour.component.html',
  styleUrls: ['./onboarding-tour.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OnboardingTourComponent {
  readonly steps: OnboardingStep[] = [
    {
      icon: '👋',
      title: 'Willkommen bei Speiseplan',
      description:
        'In wenigen Schritten zeigen wir dir, wie du Wochenpläne erstellst, einkaufst und deinen Vorrat im Blick behältst.',
    },
    {
      icon: '🗓️',
      title: 'Wochenplan & Rezepte',
      description:
        'Lege unter „Pläne“ einen Wochenplan an und füge Gerichte hinzu. Im Gerichtkatalog findest du Rezepte, Bewertungen und dein persönliches Kochbuch.',
    },
    {
      icon: '🛒',
      title: 'Automatischer Warenkorb',
      description:
        'Aus einem Plan erzeugst du mit einem Tipp die passende Einkaufsliste. Abgehakte Artikel wandern nach dem Einkauf direkt in den Vorratsschrank.',
    },
    {
      icon: '📷',
      title: 'Zutaten scannen',
      description:
        'Fotografiere deine Zutaten und lass die App sie automatisch erkennen und der Einkaufsliste hinzufügen.',
    },
    {
      icon: '🎥',
      title: 'Creator entdecken',
      description:
        'Folge Creatorn, übernimm ihre Pläne und Rezepte und werde über neue Inhalte benachrichtigt.',
    },
    {
      icon: '🏅',
      title: 'Fortschritt & Abzeichen',
      description:
        'Für jedes gekochte Gericht sammelst du XP, baust Koch-Streaks auf und schaltest Abzeichen sowie Profilrahmen frei.',
    },
    {
      icon: '🔐',
      title: 'Anmelden für Sync',
      description:
        'Melde dich optional mit Google an, um deine Pläne und Rezepte geräteübergreifend zu synchronisieren.',
    },
  ];

  stepIndex = 0;

  constructor(readonly onboarding: OnboardingService) {}

  get step(): OnboardingStep {
    return this.steps[this.stepIndex];
  }

  get isLastStep(): boolean {
    return this.stepIndex === this.steps.length - 1;
  }

  goToStep(index: number): void {
    this.stepIndex = index;
  }

  back(): void {
    if (this.stepIndex > 0) {
      this.stepIndex--;
    }
  }

  next(): void {
    if (this.isLastStep) {
      this.onboarding.complete();
      return;
    }
    this.stepIndex++;
  }

  skip(): void {
    this.onboarding.complete();
  }
}
