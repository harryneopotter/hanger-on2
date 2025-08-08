import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CollectionForm from '@/components/features/CollectionForm';
import { CreateCollection } from '@/lib/validation/schemas';

// Mock the validation schemas
vi.mock('@/lib/validation/schemas', () => ({
  CreateCollection: {},
  CollectionRule: {},
  RuleOperator: {}
}));

const mockOnSubmit = vi.fn();
const mockOnClose = vi.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  title: 'Create Collection'
};

const mockInitialData: Partial<CreateCollection> = {
  name: 'Test Collection',
  description: 'Test Description',
  color: '#3B82F6',
  isSmartCollection: false,
  rules: [],
  garmentIds: []
};

describe('CollectionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the form when isOpen is true', () => {
      render(<CollectionForm {...defaultProps} />);
      
      expect(screen.getByText('Create Collection')).toBeInTheDocument();
      expect(screen.getByLabelText(/collection name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/smart collection/i)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<CollectionForm {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Create Collection')).not.toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<CollectionForm {...defaultProps} title="Edit Collection" />);
      
      expect(screen.getByText('Edit Collection')).toBeInTheDocument();
    });

    it('renders with initial data', () => {
      render(<CollectionForm {...defaultProps} initialData={mockInitialData} />);
      
      expect(screen.getByDisplayValue('Test Collection')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('updates collection name when typing', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'My New Collection');
      
      expect(nameInput).toHaveValue('My New Collection');
    });

    it('updates description when typing', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, 'A great collection');
      
      expect(descriptionInput).toHaveValue('A great collection');
    });

    it('selects color when clicking color button', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const colorButtons = screen.getAllByRole('button');
      const redColorButton = colorButtons.find(button => 
        button.style.backgroundColor === 'rgb(239, 68, 68)' // #EF4444
      );
      
      if (redColorButton) {
        await user.click(redColorButton);
        expect(redColorButton).toHaveClass('scale-110');
      }
    });

    it('toggles smart collection checkbox', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Smart Collection Rules', () => {
    it('shows rules section when smart collection is enabled', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      expect(screen.getByText('Rules')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add rule/i })).toBeInTheDocument();
    });

    it('adds a new rule when Add Rule button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      const addRuleButton = screen.getByRole('button', { name: /add rule/i });
      await user.click(addRuleButton);
      
      expect(screen.getByDisplayValue('category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('EQUALS')).toBeInTheDocument();
    });

    it('updates rule field when changed', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      const addRuleButton = screen.getByRole('button', { name: /add rule/i });
      await user.click(addRuleButton);
      
      const fieldSelect = screen.getByDisplayValue('category');
      await user.selectOptions(fieldSelect, 'color');
      
      expect(fieldSelect).toHaveValue('color');
    });

    it('updates rule operator when changed', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      const addRuleButton = screen.getByRole('button', { name: /add rule/i });
      await user.click(addRuleButton);
      
      const operatorSelect = screen.getByDisplayValue('EQUALS');
      await user.selectOptions(operatorSelect, 'CONTAINS');
      
      expect(operatorSelect).toHaveValue('CONTAINS');
    });

    it('updates rule value when typing', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      const addRuleButton = screen.getByRole('button', { name: /add rule/i });
      await user.click(addRuleButton);
      
      const valueInput = screen.getByPlaceholderText('Value');
      await user.type(valueInput, 'red');
      
      expect(valueInput).toHaveValue('red');
    });

    it('removes rule when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      const addRuleButton = screen.getByRole('button', { name: /add rule/i });
      await user.click(addRuleButton);
      
      expect(screen.getByDisplayValue('category')).toBeInTheDocument();
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      expect(screen.queryByDisplayValue('category')).not.toBeInTheDocument();
    });

    it('shows empty state message when no rules are added', async () => {
      const user = userEvent.setup();
      render(<CollectionForm {...defaultProps} />);
      
      const checkbox = screen.getByLabelText(/smart collection/i);
      await user.click(checkbox);
      
      expect(screen.getByText(/no rules added yet/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form with correct data', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      
      render(<CollectionForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/collection name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /save collection/i });
      
      await user.type(nameInput, 'Test Collection');
      await user.type(descriptionInput, 'Test Description');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Test Collection',
          description: 'Test Description',
          color: '#3B82F6',
          image: '',
          isSmartCollection: false,
          rules: [],
          garmentIds: []
        });
      });
    });

    it('submits smart collection with rules', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      
      render(<CollectionForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/collection name/i);
      const checkbox = screen.getByLabelText(/smart collection/i);
      
      await user.type(nameInput, 'Smart Collection');
      await user.click(checkbox);
      
      const addRuleButton = screen.getByRole('button', { name: /add rule/i });
      await user.click(addRuleButton);
      
      const valueInput = screen.getByPlaceholderText('Value');
      await user.type(valueInput, 'shirt');
      
      const submitButton = screen.getByRole('button', { name: /save collection/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Smart Collection',
          description: '',
          color: '#3B82F6',
          image: '',
          isSmartCollection: true,
          rules: [{
            field: 'category',
            operator: 'EQUALS',
            value: 'shirt'
          }],
          garmentIds: []
        });
      });
    });

    it('disables submit button when name is empty', () => {
      render(<CollectionForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /save collection/i });
      expect(submitButton).toBeDisabled();
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<CollectionForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/collection name/i);
      const submitButton = screen.getByRole('button', { name: /save collection/i });
      
      await user.type(nameInput, 'Test Collection');
      await user.click(submitButton);
      
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('displays error message when submission fails', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Failed to save'));
      
      render(<CollectionForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/collection name/i);
      const submitButton = screen.getByRole('button', { name: /save collection/i });
      
      await user.type(nameInput, 'Test Collection');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to save')).toBeInTheDocument();
      });
    });

    it('closes form and resets data after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      
      render(<CollectionForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/collection name/i);
      const submitButton = screen.getByRole('button', { name: /save collection/i });
      
      await user.type(nameInput, 'Test Collection');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Initial Data Handling', () => {
    it('populates form with initial data including smart collection rules', () => {
      const initialDataWithRules = {
        ...mockInitialData,
        isSmartCollection: true,
        rules: [{
          field: 'category',
          operator: 'EQUALS' as const,
          value: 'shirt'
        }]
      };
      
      render(<CollectionForm {...defaultProps} initialData={initialDataWithRules} />);
      
      expect(screen.getByDisplayValue('Test Collection')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByLabelText(/smart collection/i)).toBeChecked();
      expect(screen.getByDisplayValue('category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('EQUALS')).toBeInTheDocument();
      expect(screen.getByDisplayValue('shirt')).toBeInTheDocument();
    });
  });
});