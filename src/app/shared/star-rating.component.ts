import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: false,
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StarRatingComponent {
  @Input() average: number | null = null;
  @Input() count = 0;
  @Input() interactive = false;
  @Input() value: number | null = null;
  @Output() rated = new EventEmitter<number>();

  readonly stars = [1, 2, 3, 4, 5];
  hoverValue: number | null = null;

  get displayValue(): number {
    if (this.interactive) {
      return this.hoverValue ?? this.value ?? 0;
    }
    return this.average ?? 0;
  }

  isFilled(star: number): boolean {
    return star <= Math.round(this.displayValue);
  }

  onEnter(star: number): void {
    if (this.interactive) {
      this.hoverValue = star;
    }
  }

  onLeave(): void {
    this.hoverValue = null;
  }

  onClick(star: number): void {
    if (this.interactive) {
      this.rated.emit(star);
    }
  }
}
