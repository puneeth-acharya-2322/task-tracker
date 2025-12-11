const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';


export async function getTasks() {
const res = await fetch(`${BASE}/tasks`);
return res.json();
}
export async function createTask(body) {
const res = await fetch(`${BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
return res.json();
}
export async function updateTask(id, body) {
const res = await fetch(`${BASE}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
return res.json();
}
export async function deleteTask(id) {
await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
}
export async function getCounts() {
const res = await fetch(`${BASE}/tasks-counts`);
return res.json();
}