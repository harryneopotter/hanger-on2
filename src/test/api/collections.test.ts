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
    body: JSON.stringify({ email: 'demo@example.com', password: 'password123' })
  });
};

// Helper function to logout
const logoutUser = async () => {
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
};

describe('Collections API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/collections', () => {
    it('should return collections when authenticated', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/collections`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        userId: 'user-1',
        isSmartCollection: expect.any(Boolean)
      });
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/collections`);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/collections', () => {
    it('should create a new collection with valid data', async () => {
      await loginUser();

      const collectionData = {
        name: 'Test Collection',
        description: 'A test collection',
        color: '#FF5733',
        isSmartCollection: false
      };

      const response = await fetch(`${API_BASE}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        ...collectionData,
        userId: 'user-1',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should create a smart collection', async () => {
      await loginUser();

      const collectionData = {
        name: 'Smart Collection',
        description: 'A smart collection with rules',
        color: '#33FF57',
        isSmartCollection: true
      };

      const response = await fetch(`${API_BASE}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        ...collectionData,
        userId: 'user-1'
      });
      expect(data.isSmartCollection).toBe(true);
    });

    it('should return 400 for missing name', async () => {
      await loginUser();

      const collectionData = {
        description: 'A collection without name',
        color: '#FF5733'
      };

      const response = await fetch(`${API_BASE}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Name is required');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const collectionData = {
        name: 'Test Collection',
        description: 'A test collection'
      };

      const response = await fetch(`${API_BASE}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/collections/:id', () => {
    it('should return a specific collection', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/collections/c-1`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: 'c-1',
        name: expect.any(String),
        userId: 'user-1'
      });
    });

    it('should return 404 for non-existent collection', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/collections/non-existent`);
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Collection not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/collections/c-1`);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('PUT /api/collections/:id', () => {
    it('should update an existing collection', async () => {
      await loginUser();

      const updateData = {
        name: 'Updated Collection',
        description: 'Updated description',
        color: '#FF0000'
      };

      const response = await fetch(`${API_BASE}/api/collections/c-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: 'c-1',
        name: 'Updated Collection',
        description: 'Updated description',
        color: '#FF0000',
        updatedAt: expect.any(String)
      });
    });

    it('should return 404 for non-existent collection', async () => {
      await loginUser();

      const updateData = {
        name: 'Updated Name'
      };

      const response = await fetch(`${API_BASE}/api/collections/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Collection not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const updateData = {
        name: 'Updated Name'
      };

      const response = await fetch(`${API_BASE}/api/collections/c-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/collections/:id', () => {
    it('should delete an existing collection', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/collections/c-1`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent collection', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/collections/non-existent`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Collection not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/collections/c-1`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/collections/:id/garments', () => {
    it('should add a garment to a collection', async () => {
      await loginUser();

      const garmentData = {
        garmentId: 'g-1'
      };

      const response = await fetch(`${API_BASE}/api/collections/c-1/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData)
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        collectionId: 'c-1',
        garmentId: 'g-1',
        addedAt: expect.any(String)
      });
    });

    it('should return 404 for non-existent collection', async () => {
      await loginUser();

      const garmentData = {
        garmentId: 'g-1'
      };

      const response = await fetch(`${API_BASE}/api/collections/non-existent/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData)
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Collection not found');
    });

    it('should return 404 for non-existent garment', async () => {
      await loginUser();

      const garmentData = {
        garmentId: 'non-existent'
      };

      const response = await fetch(`${API_BASE}/api/collections/c-1/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData)
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Garment not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const garmentData = {
        garmentId: 'g-1'
      };

      const response = await fetch(`${API_BASE}/api/collections/c-1/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData)
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });  });
});
