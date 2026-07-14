import Constants from 'expo-constants';

function resolveApiBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:8000`;
  }
  return 'http://localhost:8000';
}

export const API_BASE_URL = resolveApiBaseUrl();

export type Receipt = {
  id: number;
  vendor: string | null;
  amount: string | null;
  purchase_date: string | null;
  category: string | null;
  image_path: string | null;
  raw_ocr_text: string | null;
  created_at: string;
  updated_at: string;
};

export type ReceiptInput = {
  vendor?: string | null;
  amount?: number | null;
  purchase_date?: string | null;
  category?: string | null;
};

export type CategorySummary = {
  category: string | null;
  total: string;
  count: number;
};

export type ReceiptSummary = {
  total: string;
  count: number;
  by_category: CategorySummary[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function listReceipts(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return request<Receipt[]>(`/receipts${query}`);
}

export function getReceipt(id: number) {
  return request<Receipt>(`/receipts/${id}`);
}

export function createReceipt(data: ReceiptInput) {
  return request<Receipt>('/receipts', { method: 'POST', body: JSON.stringify(data) });
}

export function updateReceipt(id: number, data: ReceiptInput) {
  return request<Receipt>(`/receipts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteReceipt(id: number) {
  return request<void>(`/receipts/${id}`, { method: 'DELETE' });
}

export function getSummary() {
  return request<ReceiptSummary>('/receipts/summary');
}

export async function uploadReceipt(uri: string, fileName: string, mimeType: string) {
  const formData = new FormData();
  formData.append('file', { uri, name: fileName, type: mimeType } as unknown as Blob);

  const res = await fetch(`${API_BASE_URL}/receipts/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<Receipt>;
}
