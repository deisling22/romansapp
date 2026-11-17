import { of, Subject, throwError } from 'rxjs';
import { PantryApiService } from '../../core/pantry-api.service';
import { PurchaseInboxService } from '../../core/purchase-inbox.service';
import { PurchaseDocumentService } from './purchase-document.service';
import { PurchaseImportComponent } from './purchase-import.component';
import { PantryItem } from '../../core/models';

describe('PurchaseImportComponent', () => {
  let pantry: jasmine.SpyObj<PantryApiService>;
  let documents: jasmine.SpyObj<PurchaseDocumentService>;
  let inbox: PurchaseInboxService;
  let component: PurchaseImportComponent;

  beforeEach(() => {
    pantry = jasmine.createSpyObj('PantryApiService', ['addBatch']);
    documents = jasmine.createSpyObj('PurchaseDocumentService', ['read']);
    inbox = new PurchaseInboxService();
    component = new PurchaseImportComponent(documents, pantry, inbox);
    pantry.addBatch.and.returnValue(of([]));
  });

  it('consumes shared text without saving until confirmed', () => {
    inbox.text.set('500g Mehl');
    component.ngOnInit();
    expect(inbox.text()).toBe('');
    expect(component.items[0].quantity).toBe(500);
    expect(pantry.addBatch).not.toHaveBeenCalled();
  });

  it('saves only selected and edited products, then clears the draft', async () => {
    component.text = 'Butter 250g\nSeife';
    component.parse();
    component.items[0].quantity = 500;
    component.items[1].selected = false;
    await component.save();
    expect(pantry.addBatch).toHaveBeenCalledOnceWith([{ ingredientName: 'Butter', quantity: 500, unit: 'g' }]);
    expect(component.items).toEqual([]);
    expect(component.success()).toContain('1 Artikel');
    await component.save();
    expect(pantry.addBatch).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid quantities, blank names and empty selections', async () => {
    for (const quantity of [0, -1, NaN, Infinity]) {
      component.items = [{ ingredientName: 'Mehl', quantity, unit: 'g', selected: true }];
      await component.save();
      expect(component.error()).toBeTruthy();
    }
    component.items = [{ ingredientName: ' ', quantity: 1, unit: 'g', selected: true }];
    await component.save();
    component.items[0].selected = false;
    await component.save();
    expect(pantry.addBatch).not.toHaveBeenCalled();
  });

  it('keeps draft data on API failure and reports an error', async () => {
    spyOn(console, 'error');
    pantry.addBatch.and.returnValue(throwError(() => new Error('offline')));
    component.text = 'Brot';
    component.parse();
    await component.save();
    expect(component.items.length).toBe(1);
    expect(component.error()).toContain('nicht bestätigt');
    expect(component.saving()).toBeFalse();
    expect(component.success()).toBe('');
  });

  it('prevents double submission while a request is pending', async () => {
    const response = new Subject<PantryItem[]>();
    pantry.addBatch.and.returnValue(response);
    component.text = 'Brot';
    component.parse();
    const pending = component.save();
    await component.save();
    expect(pantry.addBatch).toHaveBeenCalledTimes(1);
    response.next([]);
    response.complete();
    await pending;
  });

  it('handles dropped shopping text', async () => {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', '2 Zwiebeln');
    await component.drop(new DragEvent('drop', { dataTransfer }));
    expect(component.items[0].quantity).toBe(2);
    expect(pantry.addBatch).not.toHaveBeenCalled();
  });

  it('reads dropped files through the shared document pipeline', async () => {
    documents.read.and.resolveTo('Butter 250g 1,99 A\nSUMME 1,99');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File(['pdf'], 'bon.pdf', { type: 'application/pdf' }));
    await component.drop(new DragEvent('drop', { dataTransfer }));
    expect(documents.read).toHaveBeenCalled();
    expect(component.items[0].quantity).toBe(250);
    expect(component.busy()).toBeFalse();
  });

  it('leaves the previous draft intact when file reading fails', async () => {
    spyOn(console, 'error');
    documents.read.and.rejectWith(new Error('Defekte PDF'));
    component.text = 'Brot';
    component.parse();
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File(['bad'], 'bon.pdf', { type: 'application/pdf' }));
    await component.drop(new DragEvent('drop', { dataTransfer }));
    expect(component.items[0].ingredientName).toBe('Brot');
    expect(component.error()).toContain('Defekte PDF');
  });
});
