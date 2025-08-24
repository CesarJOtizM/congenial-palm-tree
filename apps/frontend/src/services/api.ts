import { apiConfig } from '@config/env.config';
import {
  ApiResponse,
  AuthResponse,
  CreateDebtRequest,
  DashboardSummary,
  Debt,
  DebtQuery,
  DebtsPaginatedResponse,
  LoginRequest,
  RegisterRequest,
  UpdateDebtRequest,
  User,
  UsersPaginatedResponse,
} from '@types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = apiConfig.url;
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token de autenticación
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores de autenticación
    this.api.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticación
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> =
      await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> =
      await this.api.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> =
      await this.api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  // Métodos de deudas
  async getDebts(
    query: DebtQuery = {}
  ): Promise<ApiResponse<DebtsPaginatedResponse>> {
    const response: AxiosResponse<ApiResponse<DebtsPaginatedResponse>> =
      await this.api.get('/debts', { params: query });
    return response.data;
  }

  async getDebt(id: string): Promise<ApiResponse<Debt>> {
    const response: AxiosResponse<ApiResponse<Debt>> = await this.api.get(
      `/debts/${id}`
    );
    return response.data;
  }

  async createDebt(debtData: CreateDebtRequest): Promise<ApiResponse<Debt>> {
    const response: AxiosResponse<ApiResponse<Debt>> = await this.api.post(
      '/debts',
      debtData
    );
    return response.data;
  }

  async updateDebt(
    id: string,
    debtData: UpdateDebtRequest
  ): Promise<ApiResponse<Debt>> {
    const response: AxiosResponse<ApiResponse<Debt>> = await this.api.put(
      `/debts/${id}`,
      debtData
    );
    return response.data;
  }

  async deleteDebt(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/debts/${id}`);

    // Si el backend devuelve 204 (No Content), creamos una respuesta exitosa
    if (response.status === 204) {
      return {
        success: true,
        message: 'Deuda eliminada exitosamente',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    }

    // Para otros status codes, devolvemos la respuesta normal
    return response.data;
  }

  async markDebtAsPaid(id: string): Promise<ApiResponse<Debt>> {
    const response: AxiosResponse<ApiResponse<Debt>> = await this.api.put(
      `/debts/${id}/mark-as-paid`
    );
    return response.data;
  }

  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    const response: AxiosResponse<ApiResponse<DashboardSummary>> =
      await this.api.get('/debts/dashboard/summary');
    return response.data;
  }

  async exportDebts(
    format: 'json' | 'csv',
    filters: DebtQuery = {}
  ): Promise<Blob> {
    const response = await this.api.post(
      '/debts/export',
      {
        format,
        filters,
      },
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  // Métodos de usuarios
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> =
      await this.api.get('/users/me');
    return response.data;
  }

  async getUsers(): Promise<ApiResponse<UsersPaginatedResponse>> {
    const response: AxiosResponse<ApiResponse<UsersPaginatedResponse>> =
      await this.api.get('/users');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
