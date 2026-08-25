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
      // The top-level 'tesseract.js' entry relies on package.json "browser" field remapping
      // to swap out its Node.js worker (worker_threads) for the browser one; Angular's esbuild
      // builder does not honor that remap, so the Node worker ends up in the browser bundle and
      // crashes at runtime. Importing the prebuilt browser bundle directly avoids that entirely.
      this.workerPromise = import('tesseract.js/dist/tesseract.esm.min.js')
        .then(({ default: Tesseract }) => Tesseract.createWorker('deu'))
        .catch((error: unknown) => {
          this.workerPromise = null;
          throw error;
        });
    }
    return this.workerPromise;
  }
}
