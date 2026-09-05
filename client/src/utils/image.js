// Product, category and order images are stored in the database as paths relative
// to the API origin (e.g. "/catalog/sherwani-emerald-1.svg" or "/uploads/167123.jpg").
// This keeps the same data portable across dev/staging/production without baking in
// a hostname at seed- or upload-time. Any already-absolute URL (http/https) is left
// untouched, so real external photography (if you ever add it) still works.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function resolveImage(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (/^(https?:)?\/\//i.test(pathOrUrl) || pathOrUrl.startsWith('data:')) return pathOrUrl;
  return `${API_ORIGIN}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}
