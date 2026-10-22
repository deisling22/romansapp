import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CreatorApiService } from '../../core/creator-api.service';
import { CreatorSummary } from '../../core/models';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-creator-feed',
    templateUrl: './creator-feed.component.html',
    styleUrls: ['./creators.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink],
})
export class CreatorFeedComponent implements OnInit {
  creators: CreatorSummary[] = [];
  activeIndex = 0;
  loading = true;
  errorMessage = '';

  constructor(private readonly creatorApi: CreatorApiService) {}

  ngOnInit(): void {
    this.creatorApi.getCreators().subscribe({
      next: (creators) => {
        this.creators = creators;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Creator konnten nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  updateActiveCreator(container: HTMLElement): void {
    this.activeIndex = Math.round(container.scrollTop / container.clientHeight);
  }

  scrollToCreator(container: HTMLElement, index: number): void {
    container.scrollTo({ top: container.clientHeight * index, behavior: 'smooth' });
  }
}