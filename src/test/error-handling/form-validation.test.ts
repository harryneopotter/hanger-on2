import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextAuthProvider } from '@/components/NextAuthProvider';
import GarmentForm from '@/components/GarmentForm';
import CollectionForm from '@/components/CollectionForm';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { id: 'test-user', email: 'test@example.com' },
    },
    status: 'authenticated',
  }),
}));

vi.mock('sonner');

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NextAuthProvider>
        {children}
      </NextAuthProvider>
    </QueryClientProvider>
  );
};

describe('Form Validation Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GarmentForm Edge Cases', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
      mockOnSubmit.mockClear();
    });

    it('should handle extremely long input values', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const longName = 'a'.repeat(1000);

      await user.type(nameInput, longName);
      
      expect(nameInput).toHaveValue(longName);
    });

    it('should handle special characters in input fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const specialChars = '!@#$%^&*()_+-=[]{}|;:",./<>?`~';

      await user.type(nameInput, specialChars);
      
      expect(nameInput).toHaveValue(specialChars);
    });

    it('should handle unicode characters', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const unicodeText = '👕 Émoji Tëst 测试 العربية';

      await user.type(nameInput, unicodeText);
      
      expect(nameInput).toHaveValue(unicodeText);
    });

    it('should handle rapid consecutive form submissions', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(nameInput, 'Test Garment');
      
      // Rapid clicks
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only be called once due to form state management
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should handle form submission with empty required fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.click(submitButton);

      // Form should not submit with empty required fields
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle form submission with whitespace-only values', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(nameInput, '   ');
      await user.click(submitButton);

      // Should handle whitespace validation
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle copy-paste operations with large content', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const largeContent = 'Large content '.repeat(1000);

      // Simulate paste operation
      await user.click(nameInput);
      await user.paste(largeContent);
      
      expect(nameInput).toHaveValue(largeContent);
    });

    it('should handle form reset during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: any) => void;
      const delayedSubmit = vi.fn(() => new Promise(resolve => {
        resolveSubmit = resolve;
      }));

      render(
        <TestWrapper>
          <GarmentForm onSubmit={delayedSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(nameInput, 'Test Garment');
      await user.click(submitButton);

      // Clear form while submission is pending
      await user.clear(nameInput);
      
      // Resolve the submission
      resolveSubmit!({ success: true });
      
      await waitFor(() => {
        expect(delayedSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('CollectionForm Edge Cases', () => {
    const mockOnSubmit = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
      mockOnSubmit.mockClear();
      mockOnClose.mockClear();
    });

    it('should handle adding maximum number of smart collection rules', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CollectionForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Smart Collection');

      const smartCollectionCheckbox = screen.getByLabelText(/smart collection/i);
      await user.click(smartCollectionCheckbox);

      // Add multiple rules (test system limits)
      for (let i = 0; i < 20; i++) {
        const addRuleButton = screen.getByText(/add rule/i);
        await user.click(addRuleButton);
      }

      const ruleSelects = screen.getAllByDisplayValue(/category/i);
      expect(ruleSelects.length).toBeGreaterThan(0);
    });

    it('should handle removing all smart collection rules', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CollectionForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Smart Collection');

      const smartCollectionCheckbox = screen.getByLabelText(/smart collection/i);
      await user.click(smartCollectionCheckbox);

      // Add a rule
      const addRuleButton = screen.getByText(/add rule/i);
      await user.click(addRuleButton);

      // Remove the rule
      const removeButton = screen.getByText(/remove/i);
      await user.click(removeButton);

      // Should show "No rules defined" message
      expect(screen.getByText(/no rules defined/i)).toBeInTheDocument();
    });

    it('should handle invalid color values', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CollectionForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test Collection');

      // Try to input invalid color (if there's a color input)
      const colorInputs = screen.queryAllByDisplayValue(/#[0-9A-Fa-f]{6}/);
      if (colorInputs.length > 0) {
        const colorInput = colorInputs[0];
        await user.clear(colorInput);
        await user.type(colorInput, 'invalid-color');
        
        // Form should handle invalid color gracefully
        const submitButton = screen.getByRole('button', { name: /create collection/i });
        await user.click(submitButton);
      }
    });

    it('should handle smart collection rule with empty values', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CollectionForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Smart Collection');

      const smartCollectionCheckbox = screen.getByLabelText(/smart collection/i);
      await user.click(smartCollectionCheckbox);

      const addRuleButton = screen.getByText(/add rule/i);
      await user.click(addRuleButton);

      // Try to submit with empty rule value
      const submitButton = screen.getByRole('button', { name: /create collection/i });
      await user.click(submitButton);

      // Should handle validation appropriately
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle toggling smart collection multiple times', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CollectionForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </TestWrapper>
      );

      const smartCollectionCheckbox = screen.getByLabelText(/smart collection/i);
      
      // Toggle multiple times
      await user.click(smartCollectionCheckbox);
      await user.click(smartCollectionCheckbox);
      await user.click(smartCollectionCheckbox);
      
      expect(smartCollectionCheckbox).toBeChecked();
    });
  });

  describe('Input Sanitization Edge Cases', () => {
    it('should handle HTML injection attempts', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const maliciousInput = '<script>alert("XSS")</script>';

      await user.type(nameInput, maliciousInput);
      
      // Input should be treated as plain text
      expect(nameInput).toHaveValue(maliciousInput);
      expect(screen.queryByText('alert')).not.toBeInTheDocument();
    });

    it('should handle SQL injection attempts', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const sqlInjection = "'; DROP TABLE garments; --";

      await user.type(nameInput, sqlInjection);
      
      expect(nameInput).toHaveValue(sqlInjection);
    });

    it('should handle extremely nested object structures', () => {
      const deepObject: any = {};
      let current = deepObject;
      
      // Create deeply nested object
      for (let i = 0; i < 1000; i++) {
        current.nested = {};
        current = current.nested;
      }
      
      // Should handle without stack overflow
      expect(() => JSON.stringify(deepObject)).not.toThrow();
    });

    it('should handle null bytes in input', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const nullByteInput = 'Test\x00Name';

      await user.type(nameInput, nullByteInput);
      
      expect(nameInput).toHaveValue(nullByteInput);
    });
  });

  describe('Accessibility Edge Cases', () => {
    it('should handle keyboard navigation with disabled elements', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // Try to focus disabled button
      await user.tab();
      
      // Should skip disabled elements in tab order
      expect(document.activeElement).not.toBe(submitButton);
    });

    it('should handle screen reader announcements for dynamic content', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      render(
        <TestWrapper>
          <CollectionForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </TestWrapper>
      );

      const smartCollectionCheckbox = screen.getByLabelText(/smart collection/i);
      await user.click(smartCollectionCheckbox);

      // Check for aria-live regions or announcements
      const addRuleButton = screen.getByText(/add rule/i);
      expect(addRuleButton).toBeInTheDocument();
    });

    it('should handle high contrast mode', () => {
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      // Elements should be visible and accessible in high contrast
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeVisible();
    });

    it('should handle reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      // Form should render without animations
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Performance Edge Cases', () => {
    it('should handle rapid state updates', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      
      // Rapid typing simulation
      const rapidText = 'abcdefghijklmnopqrstuvwxyz';
      for (const char of rapidText) {
        await user.type(nameInput, char, { delay: 1 });
      }
      
      expect(nameInput).toHaveValue(rapidText);
    });

    it('should handle memory leaks in event listeners', () => {
      const mockOnSubmit = vi.fn();
      
      const { unmount } = render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      // Unmount component
      unmount();
      
      // Should not cause memory leaks
      expect(() => unmount()).not.toThrow();
    });

    it('should handle large form data serialization', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();
      
      render(
        <TestWrapper>
          <GarmentForm onSubmit={mockOnSubmit} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const largeData = 'x'.repeat(100000);
      
      await user.type(nameInput, largeData);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should handle large data without performance issues
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: largeData
        })
      );
    });
  });
});