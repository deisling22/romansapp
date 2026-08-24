import { environment } from '../../environments/environment';

const backendUrl = environment.apiUrl.replace(/\/api$/, '');

export function toAbsoluteImageUrl(path: string): string {
  return path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:') ? path : `${backendUrl}${path}`;
}
