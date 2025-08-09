import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '../server';

// Mock fetch for testing
global.fetch = vi.fn();

const API_BASE = 'http://localhost:3000';

// Helper function to login
const loginUser = async () => {
  await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@example.com', password: 'password123' }),
  });
};

// Helper function to logout
const logoutUser = async () => {
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
};

describe('Tags API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/tags', () => {
    it('should return tags when authenticated', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/tags`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        color: expect.any(String),
        userId: 'user-1',
        createdAt: expect.any(String),
      });
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/tags`);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/tags', () => {
    it('should create a new tag with valid data', async () => {
      await loginUser();

      const tagData = {
        name: 'Test Tag',
        color: '#FF5733',
      };

      const response = await fetch(`${API_BASE}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        ...tagData,
        userId: 'user-1',
        createdAt: expect.any(String),
      });
    });

    it('should create a tag with default color if not provided', async () => {
      await loginUser();

      const tagData = {
        name: 'Tag Without Color',
      };

      const response = await fetch(`${API_BASE}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        name: 'Tag Without Color',
        userId: 'user-1',
        createdAt: expect.any(String),
      });
    });

    it('should return 400 for missing name', async () => {
      await loginUser();

      const tagData = {
        color: '#FF5733',
      };

      const response = await fetch(`${API_BASE}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Name is required');
    });

    it('should return 409 for duplicate tag name', async () => {
      await loginUser();

      const tagData = {
        name: 'Casual', // This tag already exists in mock data
        color: '#FF5733',
      };

      const response = await fetch(`${API_BASE}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('Tag already exists');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const tagData = {
        name: 'Test Tag',
        color: '#FF5733',
      };

      const response = await fetch(`${API_BASE}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('PUT /api/tags/:id', () => {
    it('should update an existing tag', async () => {
      await loginUser();

      const updateData = {
        name: 'Updated Tag',
        color: '#00FF00',
      };

      const response = await fetch(`${API_BASE}/api/tags/t-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: 't-1',
        name: 'Updated Tag',
        color: '#00FF00',
      });
    });

    it('should update only the name', async () => {
      await loginUser();

      const updateData = {
        name: 'New Name Only',
      };

      const response = await fetch(`${API_BASE}/api/tags/t-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.name).toBe('New Name Only');
      expect(data.id).toBe('t-1');
    });

    it('should update only the color', async () => {
      await loginUser();

      const updateData = {
        color: '#FF00FF',
      };

      const response = await fetch(`${API_BASE}/api/tags/t-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.color).toBe('#FF00FF');
      expect(data.id).toBe('t-1');
    });

    it('should return 404 for non-existent tag', async () => {
      await loginUser();

      const updateData = {
        name: 'Updated Name',
      };

      const response = await fetch(`${API_BASE}/api/tags/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Tag not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const updateData = {
        name: 'Updated Name',
      };

      const response = await fetch(`${API_BASE}/api/tags/t-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/tags/:id', () => {
    it('should delete an existing tag', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/tags/t-1`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent tag', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/tags/non-existent`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Tag not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/tags/t-1`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
});
