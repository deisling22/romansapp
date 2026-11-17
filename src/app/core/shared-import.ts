export type SharedImport = { kind: 'purchase'; text: string } | { kind: 'recipe'; url: string };

export function resolveSharedImport(params: URLSearchParams): SharedImport | null {
  const text = params.get('text')?.trim() ?? '';
  const title = params.get('title')?.trim() ?? '';
  const url = /https?:\/\/\S+/.exec([params.get('url'), text, title].filter(Boolean).join(' '))?.[0];
  if (!text && !title && !url) {
    return null;
  }
  const shopping = /einkaufs(?:liste|zettel)|kassen(?:bon|beleg)|\b(?:netto|lidl|rewe|edeka|aldi|penny|kaufland)\b/i;
  if (!url || shopping.test(`${title}\n${text}\n${url}`)) {
    return { kind: 'purchase', text: (text || title).replace(/https?:\/\/\S+/g, '').trim() };
  }
  return { kind: 'recipe', url };
}
