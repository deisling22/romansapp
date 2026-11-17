import { Injectable } from '@angular/core';
import { RecipeOcrService } from '../recipe-scan/recipe-ocr.service';

@Injectable({ providedIn: 'root' })
export class PurchaseDocumentService {
  constructor(private readonly ocr: RecipeOcrService) {}

  async read(file: File, progress: (message: string) => void): Promise<string> {
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Die Datei darf maximal 20 MB groß sein.');
    }
    if (file.type.startsWith('image/')) {
      return this.ocr.recognizeText(file, 'standard', (update) =>
        progress(`Texterkennung: ${Math.round(update.progress * 100)} %`));
    }
    if (file.type === 'text/plain' || /\.txt$/i.test(file.name)) {
      return file.text();
    }
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      throw new Error('Bitte wähle ein Foto, eine PDF- oder eine Textdatei.');
    }
    progress('PDF wird geöffnet …');
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('assets/pdfjs/pdf.worker.min.mjs', document.baseURI).href;
    const assetUrl = (directory: string) => new URL(`assets/pdfjs/${directory}/`, document.baseURI).href;
    const task = pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
      wasmUrl: assetUrl('wasm'),
      standardFontDataUrl: assetUrl('standard_fonts'),
      cMapUrl: assetUrl('cmaps'),
      cMapPacked: true,
      stopAtErrors: true,
    });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > 10) {
        throw new Error('Bitte wähle eine PDF mit höchstens 10 Seiten.');
      }
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        progress(`PDF: Seite ${pageNumber} von ${pdf.numPages}`);
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        let text = '';
        let lastY: number | undefined;
        for (const item of content.items) {
          if (!('str' in item)) {
            continue;
          }
          const y = item.transform[5];
          if (lastY !== undefined && Math.abs(y - lastY) > 3) {
            text += '\n';
          }
          text += `${item.str}${item.hasEOL ? '\n' : ' '}`;
          lastY = y;
        }
        if (text.trim().length < 20) {
          const viewport = page.getViewport({ scale: 2 });
          if (viewport.width * viewport.height > 20_000_000) {
            throw new Error('Eine PDF-Seite ist zu groß. Bitte verkleinere die Datei.');
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({ canvas, viewport }).promise;
          const blob = await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob((result) => result ? resolve(result) : reject(new Error('PDF-Seite konnte nicht gelesen werden.')), 'image/png'));
          text = await this.ocr.recognizeText(new File([blob], 'page.png', { type: 'image/png' }), 'standard',
            (update) => progress(`Seite ${pageNumber}: Texterkennung ${Math.round(update.progress * 100)} %`));
          canvas.width = canvas.height = 0;
        }
        pages.push(text);
        page.cleanup();
      }
      return pages.join('\n');
    } finally {
      await task.destroy();
    }
  }
}
