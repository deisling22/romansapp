import { resolveSharedImport } from './shared-import';

describe('resolveSharedImport', () => {
  it('routes shared shopping text to the pantry import', () => {
    expect(resolveSharedImport(new URLSearchParams({ title: 'Netto Einkaufsliste', text: '2 Zwiebeln\n500g Mehl' })))
      .toEqual({ kind: 'purchase', text: '2 Zwiebeln\n500g Mehl' });
  });

  it('keeps recipe links routed to recipe scan', () => {
    expect(resolveSharedImport(new URLSearchParams({ text: 'Mein Rezept https://example.com/recipe' })))
      .toEqual({ kind: 'recipe', url: 'https://example.com/recipe' });
  });

  it('does not turn a store link into an ingredient', () => {
    expect(resolveSharedImport(new URLSearchParams({ text: 'https://netto-online.de/einkaufsliste/123' })))
      .toEqual({ kind: 'purchase', text: '' });
  });

  it('removes shopping links but preserves their accompanying product list', () => {
    expect(resolveSharedImport(new URLSearchParams({ title: 'Einkaufsliste', text: 'Brot\nhttps://example.com/list' })))
      .toEqual({ kind: 'purchase', text: 'Brot' });
  });

  it('ignores empty shares', () => {
    expect(resolveSharedImport(new URLSearchParams())).toBeNull();
  });
});
