import { RecipeOcrService } from '../recipe-scan/recipe-ocr.service';
import { PurchaseDocumentService } from './purchase-document.service';

function imageOnlyPdf(): File {
  const stream = '10 10 100 100 re S';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 300] /Resources << >> /Contents 4 0 R >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new File([pdf], 'scan.pdf', { type: 'application/pdf' });
}

describe('PurchaseDocumentService', () => {
  let ocr: jasmine.SpyObj<RecipeOcrService>;
  let service: PurchaseDocumentService;
  beforeEach(() => {
    ocr = jasmine.createSpyObj('RecipeOcrService', ['recognizeText']);
    service = new PurchaseDocumentService(ocr);
  });

  it('uses local OCR for images', async () => {
    ocr.recognizeText.and.resolveTo('Butter');
    expect(await service.read(new File(['image'], 'bon.jpg', { type: 'image/jpeg' }), () => undefined)).toBe('Butter');
    expect(ocr.recognizeText).toHaveBeenCalled();
  });

  it('reads text files without OCR', async () => {
    expect(await service.read(new File(['2 Eier'], 'liste.txt', { type: 'text/plain' }), () => undefined)).toBe('2 Eier');
    expect(ocr.recognizeText).not.toHaveBeenCalled();
  });

  it('renders PDFs without a text layer and passes the page image to OCR', async () => {
    ocr.recognizeText.and.resolveTo('Butter 250g 1,99');
    expect(await service.read(imageOnlyPdf(), () => undefined)).toBe('Butter 250g 1,99');
    expect(ocr.recognizeText).toHaveBeenCalledOnceWith(jasmine.any(File), 'standard', jasmine.any(Function));
    const image = ocr.recognizeText.calls.mostRecent().args[0];
    expect(image.type).toBe('image/png');
    expect(image.size).toBeGreaterThan(0);
  });

  it('rejects unsupported files explicitly', async () => {
    await expectAsync(service.read(new File(['zip'], 'bon.zip', { type: 'application/zip' }), () => undefined))
      .toBeRejectedWithError('Bitte wähle ein Foto, eine PDF- oder eine Textdatei.');
  });

  it('rejects oversized files before processing', async () => {
    const file = new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'big.jpg', { type: 'image/jpeg' });
    await expectAsync(service.read(file, () => undefined)).toBeRejectedWithError('Die Datei darf maximal 20 MB groß sein.');
    expect(ocr.recognizeText).not.toHaveBeenCalled();
  });
});
