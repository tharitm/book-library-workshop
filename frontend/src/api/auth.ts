import { api } from './client';

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  };
  message: string;
}

export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      const responseData = await api.post<AuthResponse>('/auth/login', credentials);

      // Store token in localStorage
      if (responseData.success && responseData.data.token) {
        localStorage.setItem('authToken', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
      }

      return responseData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  register: async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      const responseData = await api.post<AuthResponse>('/auth/register', credentials);

      // Store token in localStorage
      if (responseData.success && responseData.data.token) {
        localStorage.setItem('authToken', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
      }

      return responseData;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

export default authApi;