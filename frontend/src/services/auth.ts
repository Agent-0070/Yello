import type{ 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  ProfileUpdateRequest, 
  User 
} from '../types/auth';
import apiClient from './api';

class AuthService {
  private static readonly AUTH_STORAGE_KEY = 'auth';

  // Store auth data in localStorage
  private static setAuthData(user: User, token: string): void {
    const authData = {
      user,
      token,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.warn('Failed to store auth data in localStorage:', error);
      // Fallback: Try sessionStorage if localStorage fails
      try {
        sessionStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authData));
      } catch (fallbackError) {
        console.error('Failed to store auth data in sessionStorage too:', fallbackError);
      }
    }
  }

  // Get auth data from localStorage
  private static getAuthData(): { user: User; token: string; timestamp: number } | null {
    try {
      // Try localStorage first
      let authData = localStorage.getItem(this.AUTH_STORAGE_KEY);
      
      // If not found in localStorage, try sessionStorage
      if (!authData) {
        authData = sessionStorage.getItem(this.AUTH_STORAGE_KEY);
      }
      
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.warn('Error reading auth data from storage:', error);
      return null;
    }
  }

  // Clear auth data from localStorage
  private static clearAuthData(): void {
    try {
      localStorage.removeItem(this.AUTH_STORAGE_KEY);
      sessionStorage.removeItem(this.AUTH_STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing auth data from storage:', error);
    }
  }

  // Check if token is expired (valid for 7 days)
  private static isTokenValid(timestamp: number): boolean {
    const tokenLifetime = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    // Safely handle Date.now() and timestamp comparison
    try {
      const currentTime = typeof Date.now === 'function' ? Date.now() : new Date().getTime();
      
      // Handle potential timestamp format issues
      const parsedTimestamp = typeof timestamp === 'number' && !isNaN(timestamp)
        ? timestamp
        : new Date(timestamp).getTime();
        
      if (isNaN(parsedTimestamp)) {
        return false;
      }
      
      return currentTime - parsedTimestamp < tokenLifetime;
    } catch (error) {
      console.warn('Error validating token timestamp:', error);
      return false;
    }
  }

  // Get current authentication state
  static getAuthState(): { user: User | null; token: string | null; isAuthenticated: boolean } {
    const authData = this.getAuthData();
    
    if (authData && this.isTokenValid(authData.timestamp)) {
      return {
        user: authData.user,
        token: authData.token,
        isAuthenticated: true
      };
    }

    // Clear expired token
    if (authData) {
      this.clearAuthData();
    }

    return {
      user: null,
      token: null,
      isAuthenticated: false
    };
  }

  // Register new user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
      if (response.success && response.data) {
        this.setAuthData(response.data.user, response.data.token);
      }
      
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle network/connection errors
      if (error.message?.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: 'Network connection failed. Please check your internet connection and try again.',
          error: 'network_error'
        };
      }
      
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          success: false,
          message: 'Request timed out. Please try again.',
          error: 'timeout_error'
        };
      }
      
      // Handle server validation errors
      if (error.response?.data?.success === false) {
        const serverResponse = error.response.data;
        
        // Handle specific server error types
        if (serverResponse.error === 'username_exists' || serverResponse.error === 'email_exists') {
          return {
            success: false,
            message: serverResponse.message,
            error: serverResponse.error,
            validationErrors: serverResponse.errors
          };
        }
        
        if (serverResponse.error === 'validation_error') {
          return {
            success: false,
            message: serverResponse.message,
            error: 'validation_error',
            validationErrors: serverResponse.errors
          };
        }
        
        // Handle database connectivity issues
        if (serverResponse.error === 'database_unavailable') {
          return {
            success: false,
            message: 'Service temporarily unavailable. Please try again in a few moments.',
            error: 'service_unavailable'
          };
        }
        
        return {
          success: false,
          message: serverResponse.message || 'Registration failed',
          error: serverResponse.error,
          validationErrors: serverResponse.errors
        };
      }
      
      // Handle generic HTTP errors
      if (error.response?.status) {
        switch (error.response.status) {
          case 409:
            return {
              success: false,
              message: 'User already exists with this email or username',
              error: 'user_exists'
            };
          case 400:
            return {
              success: false,
              message: 'Invalid registration data. Please check your inputs.',
              error: 'invalid_data'
            };
          case 503:
            return {
              success: false,
              message: 'Service unavailable. Please try again later.',
              error: 'service_unavailable'
            };
          default:
            return {
              success: false,
              message: 'Registration failed. Please try again.',
              error: 'unknown_error'
            };
        }
      }
      
      // Fallback for unknown errors
      return {
        success: false,
        message: 'An unexpected error occurred during registration. Please try again.',
        error: 'unexpected_error'
      };
    }
  }

  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      
      if (response.success && response.data) {
        this.setAuthData(response.data.user, response.data.token);
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle network/connection errors
      if (error.message?.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: 'Network connection failed. Please check your internet connection and try again.',
          error: 'network_error'
        };
      }
      
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          success: false,
          message: 'Request timed out. Please try again.',
          error: 'timeout_error'
        };
      }
      
      // Handle server validation errors
      if (error.response?.data?.success === false) {
        const serverResponse = error.response.data;
        
        // Handle specific server error types
        if (serverResponse.message?.includes('Invalid email or password')) {
          return {
            success: false,
            message: 'Invalid email or password. Please try again.',
            error: 'invalid_credentials'
          };
        }
        
        if (serverResponse.message?.includes('Account is deactivated')) {
          return {
            success: false,
            message: 'Your account has been deactivated. Please contact support.',
            error: 'account_deactivated'
          };
        }
        
        // Handle database connectivity issues
        if (serverResponse.error === 'database_unavailable') {
          return {
            success: false,
            message: 'Service temporarily unavailable. Please try again in a few moments.',
            error: 'service_unavailable'
          };
        }
        
        return {
          success: false,
          message: serverResponse.message || 'Login failed',
          error: serverResponse.error,
          validationErrors: serverResponse.errors
        };
      }
      
      // Handle generic HTTP errors
      if (error.response?.status) {
        switch (error.response.status) {
          case 401:
            return {
              success: false,
              message: 'Invalid email or password. Please try again.',
              error: 'invalid_credentials'
            };
          case 503:
            return {
              success: false,
              message: 'Service unavailable. Please try again later.',
              error: 'service_unavailable'
            };
          default:
            return {
              success: false,
              message: 'Login failed. Please try again.',
              error: 'unknown_error'
            };
        }
      }
      
      // Fallback for unknown errors极速客户端
      return {
        success: false,
        message: 'An unexpected error occurred during login. Please try again.',
        error: 'unexpected_error'
      };
    }
  }

  // Logout user
  static async logout(): Promise<{ success: boolean; message: string }> {
    const authState = this.getAuthState();
    
    if (authState.isAuthenticated) {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        // Silently handle logout errors, but still clear local storage
        console.warn('Logout API call failed, but clearing local storage anyway:', error);
      }
    }
    
    this.clearAuthData();
    return { success: true, message: 'Logged out successfully' };
  }

  // Get user profile
  static async getProfile(): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/profile');
      return response;
    } catch (error: any) {
      if (error.status === 401) {
        this.clearAuthData();
        return { success: false, message: 'Session expired. Please log in again.' };
      }
      return { success: false, message: 'Failed to fetch profile' };
    }
  }

  // Update user profile
  static async updateProfile(data: ProfileUpdateRequest): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    try {
      const response = await apiClient.put<{ success: boolean; data: { user: User } }>('/auth/profile', data);
      
      if (response.success && response.data) {
        // Update stored user data
        const authData = this.getAuthData();
        if (authData) {
          const updatedUser = { ...authData.user, ...response.data.user };
          this.setAuthData(updatedUser, authData.token);
        }
      }
      
      return response;
    } catch (error: any) {
      if (error.status === 401) {
        this.clearAuthData();
        return { success: false, message: 'Session expired. Please log in again.' };
      }
      return { success: false, message: 'Failed to update profile' };
    }
  }

  // Get auth headers for API requests
  static getAuthHeaders(): Record<string, string> {
    const authState = this.getAuthState();
    return authState.isAuthenticated ? { Authorization: `Bearer ${authState.token}` } : {};
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  // Get current user
  static getCurrentUser(): User | null {
    return this.getAuthState().user;
  }

  // Get current token
  static getToken(): string | null {
    return this.getAuthState().token;
  }
}

export default AuthService;