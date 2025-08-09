import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// --- Mock Data -------------------------------------------------------------
const mockUser = {
  id: 'user-1',
  email: 'demo@example.com',
  name: 'Demo User',
};

const mockGarments = [
  {
    id: 'g-1',
    name: 'Blue Jeans',
    category: 'Pants',
    material: 'Denim',
    color: 'Blue',
    size: 'M',
    brand: "Levi's",
    status: 'CLEAN',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g-2',
    name: 'White T-Shirt',
    category: 'Tops',
    material: 'Cotton',
    color: 'White',
    size: 'L',
    brand: 'Uniqlo',
    status: 'DIRTY',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockTags = [
  {
    id: 't-1',
    name: 'Casual',
    color: '#3B82F6',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    name: 'Work',
    color: '#10B981',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    name: 'Summer',
    color: '#F59E0B',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
  },
];

const mockCollections = [
  {
    id: 'c-1',
    name: 'Work Outfits',
    description: 'Professional clothing for work',
    color: '#10B981',
    isSmartCollection: false,
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c-2',
    name: 'Summer Clothes',
    description: 'Light clothing for summer',
    color: '#F59E0B',
    isSmartCollection: true,
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let loggedIn = false;
let garments = [...mockGarments];
let tags = [...mockTags];
let collections = [...mockCollections];

// --- MSW Handlers ----------------------------------------------------------
export const handlers = [
  // Authentication
  http.post('/api/auth/signup', async ({ request }) => {
    const body = await request.json();
    if (!body.email || !body.password) {
      return HttpResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    if (body.email === 'existing@example.com') {
      return HttpResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    return HttpResponse.json({ ...mockUser, email: body.email });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'invalid@example.com') {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    loggedIn = true;
    return HttpResponse.json(mockUser);
  }),

  http.post('/api/auth/logout', () => {
    loggedIn = false;
    return new HttpResponse(null, { status: 200 });
  }),

  // Profile
  http.patch('/api/user/profile', async ({ request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    return HttpResponse.json({ ...mockUser, ...body });
  }),

  // Garments
  http.get('/api/garments', ({ request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let filteredGarments = garments;
    if (category) filteredGarments = filteredGarments.filter((g) => g.category === category);
    if (status) filteredGarments = filteredGarments.filter((g) => g.status === status);
    if (search)
      filteredGarments = filteredGarments.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()),
      );

    return HttpResponse.json(filteredGarments);
  }),

  http.post('/api/garments', async ({ request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (!body.name) {
      return HttpResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const newGarment = {
      id: `g-${Date.now()}`,
      ...body,
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    garments.push(newGarment);
    return HttpResponse.json(newGarment, { status: 201 });
  }),

  http.get('/api/garments/:id', ({ params }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const garment = garments.find((g) => g.id === id);
    if (!garment) return HttpResponse.json({ error: 'Garment not found' }, { status: 404 });
    return HttpResponse.json(garment);
  }),

  http.put('/api/garments/:id', async ({ params, request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const body = await request.json();
    const garmentIndex = garments.findIndex((g) => g.id === id);
    if (garmentIndex === -1)
      return HttpResponse.json({ error: 'Garment not found' }, { status: 404 });

    garments[garmentIndex] = {
      ...garments[garmentIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(garments[garmentIndex]);
  }),

  http.delete('/api/garments/:id', ({ params }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const garmentIndex = garments.findIndex((g) => g.id === id);
    if (garmentIndex === -1)
      return HttpResponse.json({ error: 'Garment not found' }, { status: 404 });

    garments.splice(garmentIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Tags
  http.get('/api/tags', () => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(tags);
  }),

  http.post('/api/tags', async ({ request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (!body.name) {
      return HttpResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (tags.find((t) => t.name === body.name)) {
      return HttpResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    const newTag = {
      id: `t-${Date.now()}`,
      ...body,
      userId: 'user-1',
      createdAt: new Date().toISOString(),
    };
    tags.push(newTag);
    return HttpResponse.json(newTag, { status: 201 });
  }),

  http.put('/api/tags/:id', async ({ params, request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const body = await request.json();
    const tagIndex = tags.findIndex((t) => t.id === id);
    if (tagIndex === -1) return HttpResponse.json({ error: 'Tag not found' }, { status: 404 });

    tags[tagIndex] = { ...tags[tagIndex], ...body };
    return HttpResponse.json(tags[tagIndex]);
  }),

  http.delete('/api/tags/:id', ({ params }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const tagIndex = tags.findIndex((t) => t.id === id);
    if (tagIndex === -1) return HttpResponse.json({ error: 'Tag not found' }, { status: 404 });

    tags.splice(tagIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Collections
  http.get('/api/collections', () => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(collections);
  }),

  http.post('/api/collections', async ({ request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (!body.name) {
      return HttpResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const newCollection = {
      id: `c-${Date.now()}`,
      ...body,
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    collections.push(newCollection);
    return HttpResponse.json(newCollection, { status: 201 });
  }),

  http.get('/api/collections/:id', ({ params }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const collection = collections.find((c) => c.id === id);
    if (!collection) return HttpResponse.json({ error: 'Collection not found' }, { status: 404 });
    return HttpResponse.json(collection);
  }),

  http.put('/api/collections/:id', async ({ params, request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const body = await request.json();
    const collectionIndex = collections.findIndex((c) => c.id === id);
    if (collectionIndex === -1)
      return HttpResponse.json({ error: 'Collection not found' }, { status: 404 });

    collections[collectionIndex] = {
      ...collections[collectionIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(collections[collectionIndex]);
  }),

  http.delete('/api/collections/:id', ({ params }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const collectionIndex = collections.findIndex((c) => c.id === id);
    if (collectionIndex === -1)
      return HttpResponse.json({ error: 'Collection not found' }, { status: 404 });

    collections.splice(collectionIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Collection Garments
  http.post('/api/collections/:id/garments', async ({ params, request }) => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = params;
    const body = await request.json();
    const collection = collections.find((c) => c.id === id);
    if (!collection) return HttpResponse.json({ error: 'Collection not found' }, { status: 404 });

    const garment = garments.find((g) => g.id === body.garmentId);
    if (!garment) return HttpResponse.json({ error: 'Garment not found' }, { status: 404 });

    return HttpResponse.json(
      { collectionId: id, garmentId: body.garmentId, addedAt: new Date().toISOString() },
      { status: 201 },
    );
  }),

  // Images
  http.post('/api/images', async () => {
    if (!loggedIn) return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(
      {
        id: `img-${Date.now()}`,
        url: 'https://example.com/mock-image.jpg',
        fileName: 'mock-image.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
      },
      { status: 201 },
    );
  }),
];

// --- Server ---------------------------------------------------------------
export const server = setupServer(...handlers);
