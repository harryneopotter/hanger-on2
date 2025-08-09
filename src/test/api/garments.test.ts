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

describe('Garments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/garments', () => {
    it('should return garments when authenticated', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        category: expect.any(String),
        userId: 'user-1',
      });
    });

    it('should filter garments by category', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments?category=Pants`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      data.forEach((garment) => {
        expect(garment.category).toBe('Pants');
      });
    });

    it('should filter garments by status', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments?status=CLEAN`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      data.forEach((garment) => {
        expect(garment.status).toBe('CLEAN');
      });
    });

    it('should search garments by name', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments?search=jeans`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      data.forEach((garment) => {
        expect(garment.name.toLowerCase()).toContain('jeans');
      });
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/garments`);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/garments', () => {
    it('should create a new garment with valid data', async () => {
      await loginUser();

      const garmentData = {
        name: 'Test Shirt',
        category: 'Tops',
        material: 'Cotton',
        color: 'Red',
        size: 'M',
        brand: 'Test Brand',
        status: 'CLEAN',
      };

      const response = await fetch(`${API_BASE}/api/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        ...garmentData,
        userId: 'user-1',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 400 for missing name', async () => {
      await loginUser();

      const garmentData = {
        category: 'Tops',
        material: 'Cotton',
      };

      const response = await fetch(`${API_BASE}/api/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Name is required');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const garmentData = {
        name: 'Test Shirt',
        category: 'Tops',
      };

      const response = await fetch(`${API_BASE}/api/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(garmentData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/garments/:id', () => {
    it('should return a specific garment', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments/g-1`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: 'g-1',
        name: expect.any(String),
        userId: 'user-1',
      });
    });

    it('should return 404 for non-existent garment', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments/non-existent`);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Garment not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/garments/g-1`);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('PUT /api/garments/:id', () => {
    it('should update an existing garment', async () => {
      await loginUser();

      const updateData = {
        name: 'Updated Jeans',
        color: 'Dark Blue',
      };

      const response = await fetch(`${API_BASE}/api/garments/g-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        id: 'g-1',
        name: 'Updated Jeans',
        color: 'Dark Blue',
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 for non-existent garment', async () => {
      await loginUser();

      const updateData = {
        name: 'Updated Name',
      };

      const response = await fetch(`${API_BASE}/api/garments/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Garment not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const updateData = {
        name: 'Updated Name',
      };

      const response = await fetch(`${API_BASE}/api/garments/g-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/garments/:id', () => {
    it('should delete an existing garment', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments/g-1`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent garment', async () => {
      await loginUser();

      const response = await fetch(`${API_BASE}/api/garments/non-existent`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Garment not found');
    });

    it('should return 401 when not authenticated', async () => {
      await logoutUser();

      const response = await fetch(`${API_BASE}/api/garments/g-1`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
});
