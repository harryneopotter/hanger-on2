import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '../server';
import { rest } from 'msw';

// Mock fetch for testing
global.fetch = vi.fn();

const API_BASE = 'http://localhost:3000';

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        email: userData.email,
        name: expect.any(String)
      });
    });

    it('should return 400 for missing email', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Email and password required');
    });

    it('should return 400 for missing password', async () => {
      const userData = {
        email: 'test@example.com'
      };

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Email and password required');
    });

    it('should return 409 for existing user', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'demo@example.com',
        password: 'password123'
      };

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: 'user-1',
        email: 'demo@example.com',
        name: 'Demo User'
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      };

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      // First login
      await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@example.com', password: 'password123' })
      });

      // Then logout
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST'
      });

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/user/profile', () => {
    it('should update profile when authenticated', async () => {
      // First login
      await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@example.com', password: 'password123' })
      });

      const updateData = {
        name: 'Updated Name'
      };

      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.name).toBe('Updated Name');
    });

    it('should return 401 when not authenticated', async () => {
      // Ensure logged out
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });

      const updateData = {
        name: 'Updated Name'
      };

      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
});