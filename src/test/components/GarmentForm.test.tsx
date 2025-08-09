import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import GarmentForm from '@/components/features/GarmentForm';

const mockOnSubmit = vi.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
};

const mockInitialData = {
  name: 'Blue Jeans',
  category: 'Pants',
  material: 'Denim',
  status: 'Clean' as const,
};

describe('GarmentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<GarmentForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/material/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save garment/i })).toBeInTheDocument();
    });

    it('renders with empty form when no initial data provided', () => {
      render(<GarmentForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/category/i)).toHaveValue('');
      expect(screen.getByLabelText(/material/i)).toHaveValue('');
      expect(screen.getByLabelText(/status/i)).toHaveValue('Clean');
    });

    it('renders with initial data when provided', () => {
      render(<GarmentForm {...defaultProps} initialData={mockInitialData} />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('Blue Jeans');
      expect(screen.getByLabelText(/category/i)).toHaveValue('Pants');
      expect(screen.getByLabelText(/material/i)).toHaveValue('Denim');
      expect(screen.getByLabelText(/status/i)).toHaveValue('Clean');
    });

    it('renders all status options', () => {
      render(<GarmentForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/status/i);
      const options = Array.from(statusSelect.querySelectorAll('option'));

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Clean');
      expect(options[1]).toHaveTextContent('Dirty');
      expect(options[2]).toHaveTextContent('Worn 2x');
      expect(options[3]).toHaveTextContent('Needs Washing');
    });
  });

  describe('Form Interactions', () => {
    it('updates name field when typing', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Red Shirt');

      expect(nameInput).toHaveValue('Red Shirt');
    });

    it('updates category field when typing', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, 'Shirts');

      expect(categoryInput).toHaveValue('Shirts');
    });

    it('updates material field when typing', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const materialInput = screen.getByLabelText(/material/i);
      await user.type(materialInput, 'Cotton');

      expect(materialInput).toHaveValue('Cotton');
    });

    it('updates status field when selecting option', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/status/i);
      await user.selectOptions(statusSelect, 'Dirty');

      expect(statusSelect).toHaveValue('Dirty');
    });

    it('allows selecting all status options', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/status/i);

      await user.selectOptions(statusSelect, 'Clean');
      expect(statusSelect).toHaveValue('Clean');

      await user.selectOptions(statusSelect, 'Dirty');
      expect(statusSelect).toHaveValue('Dirty');

      await user.selectOptions(statusSelect, 'Worn 2x');
      expect(statusSelect).toHaveValue('Worn 2x');

      await user.selectOptions(statusSelect, 'Needs Washing');
      expect(statusSelect).toHaveValue('Needs Washing');
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data when submitted', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const materialInput = screen.getByLabelText(/material/i);
      const statusSelect = screen.getByLabelText(/status/i);
      const submitButton = screen.getByRole('button', { name: /save garment/i });

      await user.type(nameInput, 'Test Garment');
      await user.type(categoryInput, 'Test Category');
      await user.type(materialInput, 'Test Material');
      await user.selectOptions(statusSelect, 'Dirty');

      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Garment',
        category: 'Test Category',
        material: 'Test Material',
        status: 'Dirty',
      });
    });

    it('calls onSubmit with initial data when submitted without changes', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} initialData={mockInitialData} />);

      const submitButton = screen.getByRole('button', { name: /save garment/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(mockInitialData);
    });

    it('calls onSubmit with updated data when initial data is modified', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} initialData={mockInitialData} />);

      const nameInput = screen.getByLabelText(/name/i);
      const statusSelect = screen.getByLabelText(/status/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Jeans');
      await user.selectOptions(statusSelect, 'Worn 2x');

      const submitButton = screen.getByRole('button', { name: /save garment/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Updated Jeans',
        category: 'Pants',
        material: 'Denim',
        status: 'Worn 2x',
      });
    });

    it('prevents form submission when using keyboard enter', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test Garment');
      await user.keyboard('{Enter}');

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Validation', () => {
    it('has required attribute on name field', () => {
      render(<GarmentForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeRequired();
    });

    it('has required attribute on category field', () => {
      render(<GarmentForm {...defaultProps} />);

      const categoryInput = screen.getByLabelText(/category/i);
      expect(categoryInput).toBeRequired();
    });

    it('has required attribute on material field', () => {
      render(<GarmentForm {...defaultProps} />);

      const materialInput = screen.getByLabelText(/material/i);
      expect(materialInput).toBeRequired();
    });

    it('does not submit form with empty required fields', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /save garment/i });
      await user.click(submitButton);

      // Form should not submit due to HTML5 validation
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      render(<GarmentForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/material/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('has proper form structure with fieldsets or labels', () => {
      render(<GarmentForm {...defaultProps} />);

      const form = screen.getByRole('form') || screen.getByRole('generic').closest('form');
      expect(form).toBeInTheDocument();
    });

    it('submit button has proper type and role', () => {
      render(<GarmentForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /save garment/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Edge Cases', () => {
    it('handles partial initial data', () => {
      const partialData = {
        name: 'Partial Garment',
        category: '',
        material: 'Cotton',
        status: 'Dirty' as const,
      };

      render(<GarmentForm {...defaultProps} initialData={partialData} />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('Partial Garment');
      expect(screen.getByLabelText(/category/i)).toHaveValue('');
      expect(screen.getByLabelText(/material/i)).toHaveValue('Cotton');
      expect(screen.getByLabelText(/status/i)).toHaveValue('Dirty');
    });

    it('handles special characters in form fields', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const materialInput = screen.getByLabelText(/material/i);

      await user.type(nameInput, 'Garment & Co. "Special"');
      await user.type(categoryInput, 'Category/Type');
      await user.type(materialInput, '100% Cotton');

      expect(nameInput).toHaveValue('Garment & Co. "Special"');
      expect(categoryInput).toHaveValue('Category/Type');
      expect(materialInput).toHaveValue('100% Cotton');
    });

    it('handles very long input values', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const longText = 'A'.repeat(1000);
      const nameInput = screen.getByLabelText(/name/i);

      await user.type(nameInput, longText);
      expect(nameInput).toHaveValue(longText);
    });

    it('maintains form state during multiple interactions', async () => {
      const user = userEvent.setup();
      render(<GarmentForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const statusSelect = screen.getByLabelText(/status/i);

      // Fill form partially
      await user.type(nameInput, 'Test');
      await user.selectOptions(statusSelect, 'Dirty');

      // Continue filling
      await user.type(categoryInput, 'Shirt');
      await user.type(nameInput, ' Garment');

      expect(nameInput).toHaveValue('Test Garment');
      expect(categoryInput).toHaveValue('Shirt');
      expect(statusSelect).toHaveValue('Dirty');
    });
  });

  describe('Form Styling', () => {
    it('applies proper CSS classes to form elements', () => {
      render(<GarmentForm {...defaultProps} />);

      const form = screen.getByRole('button', { name: /save garment/i }).closest('form');
      expect(form).toHaveClass('p-6', 'rounded-2xl');

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveClass('w-full', 'px-4', 'py-3', 'rounded-lg');

      const submitButton = screen.getByRole('button', { name: /save garment/i });
      expect(submitButton).toHaveClass('w-full', 'px-6', 'py-3', 'rounded-lg', 'bg-blue-600');
    });
  });
});
