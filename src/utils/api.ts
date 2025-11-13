// Default to the provided production API base; override with `VITE_API_BASE` in dev if needed.
const DEFAULT_BASE = (import.meta.env?.VITE_API_BASE as string) || 'https://shayakai.onrender.com/api/v1';

function buildUrl(path: string) {
  if (!path) return DEFAULT_BASE;
  // If path looks like an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // If path already starts with /api or other absolute-style path, join with base
  if (path.startsWith('/')) {
    // If DEFAULT_BASE is a full URL, strip trailing slash
    return `${DEFAULT_BASE.replace(/\/$/, '')}${path}`;
  }
  // otherwise append
  return `${DEFAULT_BASE.replace(/\/$/, '')}/${path}`;
}

export async function postJSON(path: string, body: any) {
  const url = buildUrl(path);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Use credentials: 'include' so browser sends HttpOnly cookies (accessToken) set by backend
  const res = await fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore JSON parse errors
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText || 'Request failed';
    const err: any = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function getJSON(path: string) {
  const url = buildUrl(path);
  // Use credentials: 'include' so browser sends HttpOnly cookies (accessToken) set by backend
  const res = await fetch(url, { method: 'GET', credentials: 'include' });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText || 'Request failed';
    const err: any = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export default { postJSON, getJSON };
