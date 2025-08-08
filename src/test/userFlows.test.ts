import { expect, it, beforeEach } from 'vitest';

/**
 * These tests rely on MSW handlers defined in src/test/server.ts and lifecycle hooks in setup.ts.
 * They exercise the main customer-facing flows against mocked API endpoints.
 */

const testEmail = 'demo@example.com';
const testPassword = 'strong-password';

beforeEach(() => {
  // Ensure we start from an anonymous state per test
  // (server handler keeps internal loggedIn flag, so we log out explicitly)
  return fetch('/api/auth/logout', { method: 'POST' });
});

it('registers a new user', async () => {
  const resp = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  expect(resp.status).toBe(200);
  const data = await resp.json();
  expect(data.email).toBe(testEmail);
  expect(data.id).toBeDefined();
});

it('logs in with credentials', async () => {
  const resp = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  expect(resp.status).toBe(200);
  const user = await resp.json();
  expect(user.email).toBe('demo@example.com');
});

it('edits profile when authenticated', async () => {
  // First login
  await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });

  // Now patch profile
  const newName = 'Updated Name';
  const resp = await fetch('/api/user/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName }),
  });
  expect(resp.status).toBe(200);
  const user = await resp.json();
  expect(user.name).toBe(newName);
});

it('adds a garment when authenticated', async () => {
  // ensure logged in
  await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });

  const garment = {
    name: 'Blue Jeans',
    status: 'Clean',
    tagIds: [],
  };
  const resp = await fetch('/api/garments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(garment),
  });
  expect(resp.status).toBe(201);
  const created = await resp.json();
  expect(created.id).toBeDefined();
  expect(created.name).toBe(garment.name);
});

it('logs out successfully', async () => {
  // login first
  await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });

  const resp = await fetch('/api/auth/logout', { method: 'POST' });
  expect(resp.status).toBe(200);

  // attempt profile edit, should get 401
  const blocked = await fetch('/api/user/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Should Fail' }),
  });
  expect(blocked.status).toBe(401);
});