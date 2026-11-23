import type { JobListing, WorkMode } from '../types';

export type JobSource = 'remote' | 'local';

const REMOTIVE_URL =
  'https://remotive.com/api/remote-jobs?category=software-dev&limit=30';
const FALLBACK_URL = '/magang-fallback.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Validasi 1 item mentah -> JobListing (tanpa `any`)
function toJobListing(raw: unknown): JobListing | null {
  if (!isRecord(raw)) return null;
  const { id, title, company_name, category, candidate_required_location, salary, tags } = raw;

  if (typeof id !== 'number' || typeof title !== 'string' || typeof company_name !== 'string') {
    return null;
  }

  return {
    id,
    title,
    company_name,
    category: typeof category === 'string' ? category : 'Lainnya',
    candidate_required_location:
      typeof candidate_required_location === 'string' ? candidate_required_location : '-',
    salary: typeof salary === 'string' ? salary : '',
    tags: Array.isArray(tags)
      ? tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
  };
}

// Mendukung format array langsung ATAU { jobs: [...] } (format Remotive)
function parseJobs(data: unknown): JobListing[] {
  const list: unknown[] = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.jobs)
      ? data.jobs
      : [];

  return list
    .map(toJobListing)
    .filter((job): job is JobListing => job !== null);
}

export async function fetchJobs(
  source: JobSource,
  signal: AbortSignal,
): Promise<JobListing[]> {
  const url = source === 'remote' ? REMOTIVE_URL : FALLBACK_URL;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.');
  }

  if (!response.ok) {
    throw new Error(`Gagal mengambil data (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  return parseJobs(data);
}

// Dipakai saat "Simpan ke Wishlist": tebak mode kerja dari teks lokasi
export function inferWorkMode(location: string): WorkMode {
  const text = location.toLowerCase();
  if (text.includes('hybrid')) return 'Hybrid';
  if (text.includes('onsite') || text.includes('on-site')) return 'Onsite';
  return 'Remote';
}