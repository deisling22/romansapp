import { Injectable } from '@angular/core';
import type { Worker } from 'tesseract.js';

@Injectable({ providedIn: 'root' })
export class RecipeOcrService {
  private workerPromise: Promise<Worker> | null = null;

  async recognizeText(image: File): Promise<string> {
    const worker = await this.loadWorker();
    const { data } = await worker.recognize(image);
    return data.text;
  }

  private loadWorker(): Promise<Worker> {
    if (!this.workerPromise) {
      this.workerPromise = import('tesseract.js')
        .then(({ createWorker }) => createWorker('deu'))
        .catch((error: unknown) => {
          this.workerPromise = null;
          throw error;
        });
    }
    return this.workerPromise;
  }
}
