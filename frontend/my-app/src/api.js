
export const API_BASE = 'http://localhost:4000'; // puerto de enlace, simepre el mismo del backend
 
export async function fetchWithToken(path, options = {}) {
  const token = sessionStorage.getItem('token');
  const headers = options.headers ? {...options.headers} : {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
 
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}