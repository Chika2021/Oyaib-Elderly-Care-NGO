/**
 * OYAIB Elderly Care – API Service
 * All backend calls are centralised here.
 * Base URL is read from the environment; falls back to localhost for local dev.
 */

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://oyaib.vercel.app';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubmissionType = 'join_team' | 'donation' | 'contact' | 'video';

export interface Submission {
  id: number;
  type: SubmissionType;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  areaOfInterest: string | null;
  motivation: string | null;
  message: string | null;
  amount: number | null;
  reason: string | null;
  youtubeUrl: string | null;
  videoTitle: string | null;        // <-- new
  videoDescription: string | null;  // <-- new
  createdAt: string;
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface JoinTeamPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  areaOfInterest: string;
  motivation: string;
}

export interface HelperPayload {
  fullName: string;
  email: string;
  amount: number;
  message?: string;
}

export interface ContactPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  reason: string;
  message: string;
}

export interface VideoPayload {
  fullName: string;
  email: string;
  youtubeUrl: string;
  title: string;        // <-- new
  description: string;  // <-- new
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw { status: res.status, ...error };
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** POST /auth/login – returns JWT access_token */
export async function login(payload: LoginPayload): Promise<string> {
  const data = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.access_token;
}

// ─── Public submissions ───────────────────────────────────────────────────────

/** POST /submissions/join – Join Our Team */
export async function submitJoinTeam(
  payload: JoinTeamPayload,
): Promise<Submission> {
  return request<Submission>('/submissions/join', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /submissions/helper – Become a Helper (donation) */
export async function submitHelper(payload: HelperPayload): Promise<Submission> {
  return request<Submission>('/submissions/helper', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /submissions/contact – Write to Us */
export async function submitContact(
  payload: ContactPayload,
): Promise<Submission> {
  return request<Submission>('/submissions/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Admin / protected ────────────────────────────────────────────────────────

/** POST /submissions/video – Upload YouTube video (admin only) */
export async function submitVideo(
  payload: VideoPayload,
  token: string,
): Promise<Submission> {
  return request<Submission>(
    '/submissions/video',
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

/** GET /submissions – Fetch all submissions (admin only) */
export async function fetchSubmissions(token: string): Promise<Submission[]> {
  return request<Submission[]>('/submissions', { method: 'GET' }, token);
}

// ─── Public Videos ────────────────────────────────────────────────────────────

/** GET /submissions/videos – Fetch uploaded videos (public) */
export async function fetchVideos(): Promise<Submission[]> {
  return request<Submission[]>('/submissions/videos');
}

export interface UpdateVideoPayload {
  fullName?: string;
  email?: string;
  youtubeUrl?: string;
  title?: string;
  description?: string;
}

/** PATCH /submissions/video/:id – Update a video (admin only) */
export async function updateVideo(
  id: number,
  payload: UpdateVideoPayload,
  token: string,
): Promise<Submission> {
  return request<Submission>(
    `/submissions/video/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    token,
  );
}

/** DELETE /submissions/video/:id – Delete a video (admin only) */
export async function deleteVideo(
  id: number,
  token: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(
    `/submissions/video/${id}`,
    { method: 'DELETE' },
    token,
  );
}