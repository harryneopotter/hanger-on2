import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import GarmentCard from '../../../components/features/GarmentCard';
import { server } from '../server';

// Mock next-auth
vi.mock('next-auth/react');

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, ...props }: any) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
    img: ({ src, alt, className, ...props }: any) => (
      <img src={src} alt={alt} className={className} {...props} />
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockGarment = {
  id: 'g-1',
  name: 'Blue Jeans',
  category: 'Pants',
  material: 'Denim',
  status: 'CLEAN' as const,
  image: 'https://example.com/jeans.jpg',
};

const mockSession = {
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  },
};

describe('GarmentCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnMarkAsWorn = vi.fn();
  const mockOnMoveToLaundry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSession as any).mockReturnValue({ data: mockSession });
    global.fetch = vi.fn();
  });

  it('renders garment information correctly', () => {
    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
    expect(screen.getByText('Denim • Pants')).toBeInTheDocument();
    expect(screen.getByText('Clean')).toBeInTheDocument();
    expect(screen.getByAltText('Blue Jeans')).toBeInTheDocument();
  });

  it('displays correct status label and styling for CLEAN status', () => {
    render(<GarmentCard {...mockGarment} status="CLEAN" />);

    const statusElement = screen.getByText('Clean');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('text-emerald-700');
  });

  it('displays correct status label and styling for WORN_2X status', () => {
    render(<GarmentCard {...mockGarment} status="WORN_2X" />);

    const statusElement = screen.getByText('Worn 2x');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('text-amber-700');
  });

  it('displays correct status label and styling for DIRTY status', () => {
    render(<GarmentCard {...mockGarment} status="DIRTY" />);

    const statusElement = screen.getByText('Dirty');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('text-red-700');
  });

  it('displays correct status label and styling for NEEDS_WASHING status', () => {
    render(<GarmentCard {...mockGarment} status="NEEDS_WASHING" />);

    const statusElement = screen.getByText('Needs Washing');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('text-red-700');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const editButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onMarkAsWorn when Worn button is clicked', () => {
    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const wornButton = screen.getByText('Worn');
    fireEvent.click(wornButton);

    expect(mockOnMarkAsWorn).toHaveBeenCalledTimes(1);
  });

  it('calls onMoveToLaundry when Laundry button is clicked', () => {
    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const laundryButton = screen.getByText('Laundry');
    fireEvent.click(laundryButton);

    expect(mockOnMoveToLaundry).toHaveBeenCalledTimes(1);
  });

  it('opens collection modal when + button is clicked', () => {
    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    expect(screen.getByText('Add to Collection')).toBeInTheDocument();
  });

  it('fetches collections when modal is opened and user is authenticated', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 'c-1', name: 'Work Outfits', color: '#10B981' },
          { id: 'c-2', name: 'Casual Wear', color: '#3B82F6' },
        ]),
    });
    global.fetch = mockFetch;

    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/collections');
    });
  });

  it('displays collections in modal when available', async () => {
    const mockCollections = [
      { id: 'c-1', name: 'Work Outfits', color: '#10B981' },
      { id: 'c-2', name: 'Casual Wear', color: '#3B82F6' },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCollections),
    });
    global.fetch = mockFetch;

    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Work Outfits')).toBeInTheDocument();
      expect(screen.getByText('Casual Wear')).toBeInTheDocument();
    });
  });

  it('adds garment to collection when collection is clicked', async () => {
    const mockCollections = [{ id: 'c-1', name: 'Work Outfits', color: '#10B981' }];

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCollections),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });
    global.fetch = mockFetch;

    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Work Outfits')).toBeInTheDocument();
    });

    const collectionButton = screen.getByText('Work Outfits');
    fireEvent.click(collectionButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/collections/c-1/garments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ garmentIds: ['g-1'] }),
      });
    });
  });

  it('closes modal when Cancel button is clicked', async () => {
    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    expect(screen.getByText('Add to Collection')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Add to Collection')).not.toBeInTheDocument();
    });
  });

  it('shows message when no collections are available', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    global.fetch = mockFetch;

    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText('No collections found. Create a collection first.'),
      ).toBeInTheDocument();
    });
  });

  it('does not fetch collections when user is not authenticated', () => {
    (useSession as any).mockReturnValue({ data: null });
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    render(
      <GarmentCard
        {...mockGarment}
        onEdit={mockOnEdit}
        onMarkAsWorn={mockOnMarkAsWorn}
        onMoveToLaundry={mockOnMoveToLaundry}
      />,
    );

    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching collections:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('renders without optional callback props', () => {
    render(<GarmentCard {...mockGarment} />);

    expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
    expect(screen.getByText('Worn')).toBeInTheDocument();
    expect(screen.getByText('Laundry')).toBeInTheDocument();
  });

  it('has correct link to item detail page', () => {
    render(<GarmentCard {...mockGarment} />);

    const links = screen.getAllByRole('link');
    const itemLinks = links.filter((link) => link.getAttribute('href') === '/item/g-1');
    expect(itemLinks.length).toBeGreaterThan(0);
  });
});
