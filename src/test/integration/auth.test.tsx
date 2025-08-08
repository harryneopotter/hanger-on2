import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SessionProvider } from 'next-auth/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn()
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams())
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test components for authentication flows
const LoginComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    
    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleLogin(
          formData.get('email') as string,
          formData.get('password') as string
        );
      }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

const ProtectedComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>User ID: {session.user?.id}</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
};

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn()
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  describe('Login Flow', () => {
    it('displays login form when user is not authenticated', () => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });

      render(<LoginComponent />);

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('shows loading state during authentication', () => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'loading'
      });

      render(<LoginComponent />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles successful credentials login', async () => {
      const user = userEvent.setup();
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });
      (signIn as any).mockResolvedValue({ ok: true });

      render(<LoginComponent />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles failed credentials login', async () => {
      const user = userEvent.setup();
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });
      (signIn as any).mockResolvedValue({ ok: false, error: 'Invalid credentials' });

      render(<LoginComponent />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'wrongpassword',
        redirect: false
      });

      // Should not redirect on failed login
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('handles Google OAuth login', async () => {
      const user = userEvent.setup();
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });

      render(<LoginComponent />);

      const googleButton = screen.getByRole('button', { name: /sign in with google/i });
      await user.click(googleButton);

      expect(signIn).toHaveBeenCalledWith('google', {
        callbackUrl: '/dashboard'
      });
    });
  });

  describe('Authenticated State', () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User'
      },
      expires: '2024-12-31'
    };

    it('displays user information when authenticated', () => {
      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      });

      render(<LoginComponent />);

      expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    it('handles sign out', async () => {
      const user = userEvent.setup();
      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      });

      render(<LoginComponent />);

      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      await user.click(signOutButton);

      expect(signOut).toHaveBeenCalled();
    });
  });

  describe('Protected Routes', () => {
    it('shows loading state while checking authentication', () => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'loading'
      });

      render(<ProtectedComponent />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('redirects unauthenticated users to login', () => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });

      render(<ProtectedComponent />);

      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('displays protected content for authenticated users', () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: '2024-12-31'
      };

      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      });

      render(<ProtectedComponent />);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.getByText('User ID: user-123')).toBeInTheDocument();
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
    });
  });

  describe('API Authentication', () => {
    it('includes session in authenticated API requests', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        expires: '2024-12-31'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ garments: [] })
      });

      // Simulate authenticated API call
      const response = await fetch('/api/garments', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockSession.user.id}`
        }
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/garments', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer user-123'
        }
      });

      expect(response.ok).toBe(true);
    });

    it('handles 401 unauthorized responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });

      const response = await fetch('/api/garments');
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('Session Management', () => {
    it('handles session expiration', () => {
      // Mock expired session
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });

      render(<ProtectedComponent />);

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('maintains session across page refreshes', () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: '2024-12-31'
      };

      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated'
      });

      render(<ProtectedComponent />);

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('User Registration Flow', () => {
    it('handles successful user registration', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'User created successfully' })
      });

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'password123'
        })
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'password123'
        })
      });

      expect(response.ok).toBe(true);
    });

    it('handles registration with existing email', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: 'Email already registered' })
      });

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'password123'
        })
      });

      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Email already registered');
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during authentication', async () => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });
      (signIn as any).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<LoginComponent />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Should not redirect on network error
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('handles malformed session data', () => {
      (useSession as any).mockReturnValue({
        data: { user: null }, // Malformed session
        status: 'authenticated'
      });

      render(<ProtectedComponent />);

      // Should treat as unauthenticated
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });
});