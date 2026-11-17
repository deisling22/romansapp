import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

const START_DISTANCE = 12;
const REMOVE_DISTANCE = 96;

/** Swipe a row to the left to remove it (touch only); a regular remove button stays available. */
@Directive({ selector: '[appSwipeToRemove]' })
export class SwipeToRemoveDirective implements OnInit, OnDestroy {
  @Output() readonly swipeRemove = new EventEmitter<void>();

  private startX = 0;
  private startY = 0;
  private pointerId: number | null = null;
  private swiping = false;
  private offset = 0;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    const host = this.element.nativeElement;
    host.style.touchAction = 'pan-y';
    // Pointer moves fire constantly; only the final removal needs change detection.
    this.zone.runOutsideAngular(() => {
      host.addEventListener('pointerdown', this.onDown);
      host.addEventListener('pointermove', this.onMove);
      host.addEventListener('pointerup', this.onUp);
      host.addEventListener('pointercancel', this.onCancel);
    });
  }

  ngOnDestroy(): void {
    const host = this.element.nativeElement;
    host.removeEventListener('pointerdown', this.onDown);
    host.removeEventListener('pointermove', this.onMove);
    host.removeEventListener('pointerup', this.onUp);
    host.removeEventListener('pointercancel', this.onCancel);
  }

  private readonly onDown = (event: PointerEvent): void => {
    if (event.pointerType === 'mouse') {
      return;
    }
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.swiping = false;
    this.offset = 0;
  };

  private readonly onMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    if (!this.swiping) {
      if (deltaX > -START_DISTANCE || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) {
        return;
      }
      this.swiping = true;
      this.element.nativeElement.setPointerCapture(event.pointerId);
      this.element.nativeElement.style.transition = 'none';
    }
    this.offset = Math.min(0, deltaX);
    this.element.nativeElement.style.transform = `translateX(${this.offset}px)`;
    this.element.nativeElement.style.opacity = String(Math.max(0.35, 1 + this.offset / 240));
  };

  private readonly onUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    const remove = this.swiping && this.offset <= -REMOVE_DISTANCE;
    this.reset();
    if (remove) {
      this.zone.run(() => this.swipeRemove.emit());
    }
  };

  private readonly onCancel = (): void => this.reset();

  private reset(): void {
    const host = this.element.nativeElement;
    if (this.swiping) {
      // A swipe must not also toggle the row's checkbox.
      host.addEventListener('click', suppressClick, { capture: true, once: true });
      setTimeout(() => host.removeEventListener('click', suppressClick, { capture: true }), 350);
    }
    host.style.transition = 'transform 0.18s ease, opacity 0.18s ease';
    host.style.transform = '';
    host.style.opacity = '';
    this.pointerId = null;
    this.swiping = false;
    this.offset = 0;
  }
}

function suppressClick(event: Event): void {
  event.stopPropagation();
  event.preventDefault();
}
