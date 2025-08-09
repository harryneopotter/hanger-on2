import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TagList from '@/components/features/TagList';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTags = [
  {
    id: '1',
    name: 'Casual',
    color: '#3B82F6',
    _count: { garments: 5 },
  },
  {
    id: '2',
    name: 'Formal',
    color: '#EF4444',
    _count: { garments: 3 },
  },
  {
    id: '3',
    name: 'Summer',
    _count: { garments: 8 },
  },
];

const mockOnTagDeleted = vi.fn();

const defaultProps = {
  tags: mockTags,
  onTagDeleted: mockOnTagDeleted,
};

describe('TagList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('Rendering', () => {
    it('renders all tags', () => {
      render(<TagList {...defaultProps} />);

      expect(screen.getByText('Casual')).toBeInTheDocument();
      expect(screen.getByText('Formal')).toBeInTheDocument();
      expect(screen.getByText('Summer')).toBeInTheDocument();
    });

    it('renders tag colors when provided', () => {
      render(<TagList {...defaultProps} />);

      const casualTag = screen.getByText('Casual').closest('div');
      const formalTag = screen.getByText('Formal').closest('div');

      expect(casualTag).toHaveStyle({ backgroundColor: '#3B82F620', borderColor: '#3B82F6' });
      expect(formalTag).toHaveStyle({ backgroundColor: '#EF444420', borderColor: '#EF4444' });
    });

    it('renders color indicators for tags with colors', () => {
      render(<TagList {...defaultProps} />);

      const colorIndicators = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('w-2 h-2 rounded-full'));

      expect(colorIndicators).toHaveLength(2); // Only Casual and Formal have colors
    });

    it('shows garment count when showCount is true', () => {
      render(<TagList {...defaultProps} showCount={true} />);

      expect(screen.getByText('(5)')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText('(8)')).toBeInTheDocument();
    });

    it('does not show garment count when showCount is false', () => {
      render(<TagList {...defaultProps} showCount={false} />);

      expect(screen.queryByText('(5)')).not.toBeInTheDocument();
      expect(screen.queryByText('(3)')).not.toBeInTheDocument();
      expect(screen.queryByText('(8)')).not.toBeInTheDocument();
    });

    it('renders delete buttons for all tags', () => {
      render(<TagList {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button');
      expect(deleteButtons).toHaveLength(3);

      expect(screen.getByLabelText('Remove tag Casual')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove tag Formal')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove tag Summer')).toBeInTheDocument();
    });

    it('shows empty state when no tags provided', () => {
      render(<TagList tags={[]} />);

      expect(screen.getByText('No tags yet. Create your first tag above!')).toBeInTheDocument();
    });
  });

  describe('Tag Deletion', () => {
    it('calls delete API when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      expect(mockFetch).toHaveBeenCalledWith('/api/tags/1', {
        method: 'DELETE',
      });
    });

    it('calls onTagDeleted callback after successful deletion', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnTagDeleted).toHaveBeenCalledWith('1');
      });
    });

    it('shows loading spinner during deletion', async () => {
      const user = userEvent.setup();
      mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      expect(deleteButton.querySelector('.animate-spin')).toBeInTheDocument();
      expect(deleteButton).toBeDisabled();
    });

    it('prevents multiple deletion attempts for the same tag', async () => {
      const user = userEvent.setup();
      mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');

      // Click multiple times rapidly
      await user.click(deleteButton);
      await user.click(deleteButton);
      await user.click(deleteButton);

      // Should only make one API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('handles deletion error gracefully', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Tag not found' }),
      });

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error deleting tag:', expect.any(Error));
      });

      // Should not call onTagDeleted on error
      expect(mockOnTagDeleted).not.toHaveBeenCalled();

      // Button should be re-enabled after error
      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
      });

      consoleSpy.mockRestore();
    });

    it('handles network error during deletion', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockFetch.mockRejectedValue(new Error('Network error'));

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error deleting tag:', expect.any(Error));
      });

      expect(mockOnTagDeleted).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('resets loading state after deletion completes', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(deleteButton.querySelector('.animate-spin')).not.toBeInTheDocument();
        expect(deleteButton).not.toBeDisabled();
      });
    });
  });

  describe('Tag Styling', () => {
    it('applies default styling for tags without colors', () => {
      const tagsWithoutColor = [{ id: '1', name: 'No Color', _count: { garments: 1 } }];
      render(<TagList tags={tagsWithoutColor} />);

      const tag = screen.getByText('No Color').closest('div');
      expect(tag).toHaveClass('bg-gray-50/50', 'dark:bg-gray-800/50');
    });

    it('applies custom styling for tags with colors', () => {
      const coloredTags = [{ id: '1', name: 'Colored', color: '#FF0000', _count: { garments: 1 } }];
      render(<TagList tags={coloredTags} />);

      const tag = screen.getByText('Colored').closest('div');
      expect(tag).toHaveStyle({ backgroundColor: '#FF000020', borderColor: '#FF0000' });
    });
  });

  describe('Accessibility', () => {
    it('provides proper aria-labels for delete buttons', () => {
      render(<TagList {...defaultProps} />);

      expect(screen.getByLabelText('Remove tag Casual')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove tag Formal')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove tag Summer')).toBeInTheDocument();
    });

    it('maintains focus management during deletion', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<TagList {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      deleteButton.focus();

      expect(deleteButton).toHaveFocus();

      await user.click(deleteButton);

      // Button should maintain focus during loading
      expect(deleteButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles tags without _count property', () => {
      const tagsWithoutCount = [
        { id: '1', name: 'No Count' },
        { id: '2', name: 'Also No Count', color: '#FF0000' },
      ];

      render(<TagList tags={tagsWithoutCount} showCount={true} />);

      expect(screen.getByText('No Count')).toBeInTheDocument();
      expect(screen.getByText('Also No Count')).toBeInTheDocument();
      // Should not show count when _count is undefined
      expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
    });

    it('handles empty tag names', () => {
      const tagsWithEmptyNames = [{ id: '1', name: '', _count: { garments: 0 } }];

      render(<TagList tags={tagsWithEmptyNames} />);

      const deleteButton = screen.getByLabelText('Remove tag ');
      expect(deleteButton).toBeInTheDocument();
    });

    it('works without onTagDeleted callback', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<TagList tags={mockTags} />); // No onTagDeleted prop

      const deleteButton = screen.getByLabelText('Remove tag Casual');
      await user.click(deleteButton);

      expect(mockFetch).toHaveBeenCalledWith('/api/tags/1', {
        method: 'DELETE',
      });

      // Should not throw error when callback is not provided
      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
      });
    });
  });
});
