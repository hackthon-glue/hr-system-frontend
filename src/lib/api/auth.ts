import apiClient from '../../../lib/api/client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  first_name_kana?: string;
  last_name_kana?: string;
  role: 'candidate' | 'recruiter';
  phone?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  first_name_kana?: string;
  last_name_kana?: string;
  role: string;
  phone?: string;
  is_verified: boolean;
  date_joined: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
  message: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login/', data);

    // Store tokens
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }

    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register/', data);

    // Store tokens
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    const refresh = localStorage.getItem('refresh_token');

    if (refresh) {
      try {
        await apiClient.post('/api/auth/logout/', { refresh });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/user/');
    return response.data;
  }

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/api/auth/user/update/', data);
    return response.data;
  }

  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/api/auth/change-password/',
      data
    );
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/api/auth/password-reset/',
      { email }
    );
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export const authService = new AuthService();