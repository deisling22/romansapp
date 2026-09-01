import { Injectable } from '@angular/core';
import type { Worker } from 'tesseract.js';
import { preprocessRecipeImage } from './image-preprocessing';

export type OcrQuality = 'standard' | 'high-accuracy';

export interface OcrProgress {
  status: string;
  progress: number;
}

// The higher-accuracy German model is the original (non-integerized) tessdata_best
// traineddata from the official Tesseract project — noticeably larger than the
// integerized "best_int" data tesseract.js uses by default, but more accurate.
const HIGH_ACCURACY_LANG_PATH = 'https://cdn.jsdelivr.net/gh/tesseract-ocr/tessdata_best@main';
const HIGH_ACCURACY_CACHE_PATH = 'tessdata-best';

@Injectable({ providedIn: 'root' })
export class RecipeOcrService {
  private readonly workers = new Map<OcrQuality, Promise<Worker>>();
  private readonly progressHandlers = new Map<OcrQuality, (progress: OcrProgress) => void>();

  async recognizeText(
    image: File,
    quality: OcrQuality = 'standard',
    onProgress?: (progress: OcrProgress) => void,
  ): Promise<string> {
    if (onProgress) {
      this.progressHandlers.set(quality, onProgress);
    } else {
      this.progressHandlers.delete(quality);
    }
    const worker = await this.loadWorker(quality);
    const canvas = await preprocessRecipeImage(image);
    // Tesseract assumes ~70dpi for images without DPI metadata, which is far below what
    // a preprocessed/upscaled phone photo actually contains; without this hint it under-scales
    // its internal analysis and loses fine detail such as umlaut dots or ß.
    await worker.setParameters({ preserve_interword_spaces: '1', user_defined_dpi: '300' });
    const { data } = await worker.recognize(canvas);
    return data.text;
  }

  private loadWorker(quality: OcrQuality): Promise<Worker> {
    const existing = this.workers.get(quality);
    if (existing) {
      return existing;
    }
    // Reads whichever handler is current at the time a progress event fires, so a single
    // long-lived worker (created once, then reused) can still report progress for later calls.
    const logger = (message: { status: string; progress: number }) =>
      this.progressHandlers.get(quality)?.({ status: message.status, progress: message.progress });

    const workerPromise = import('tesseract.js/dist/tesseract.esm.min.js')
      // The top-level 'tesseract.js' entry relies on package.json "browser" field remapping
      // to swap out its Node.js worker (worker_threads) for the browser one; Angular's esbuild
      // builder does not honor that remap, so the Node worker ends up in the browser bundle and
      // crashes at runtime. Importing the prebuilt browser bundle directly avoids that entirely.
      .then(({ default: Tesseract }) =>
        quality === 'high-accuracy'
          ? Tesseract.createWorker('deu', 1, {
              langPath: HIGH_ACCURACY_LANG_PATH,
              cachePath: HIGH_ACCURACY_CACHE_PATH,
              gzip: false,
              logger,
            })
          : Tesseract.createWorker('deu', 1, { logger }),
      )
      .catch((error: unknown) => {
        this.workers.delete(quality);
        throw error;
      });
    this.workers.set(quality, workerPromise);
    return workerPromise;
  }
}


