// frontend/src/api/authService.ts
const API_URL = 'https://e-commerce-3-clba.onrender.com/api';

// ------------------- TYPES -------------------
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  shopName?: string;
  siret?: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
  token?: string;
  user?: any;
  admin?: any;
}

// ------------------- INSCRIPTION USER -------------------
export const registerUser = async (userData: UserData): Promise<ApiResponse> => {
  try {
    const datasig = {
      firstname: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      shopName: userData.shopName,
      siret: userData.siret,
      address: userData.address
    };

    const response = await fetch(`${API_URL}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datasig)
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur inscription');
    }

    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// ------------------- LOGIN USER -------------------


// ------------------- LOGIN ADMIN -------------------
export const loginAdmin = async (loginData: LoginData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur login admin');
    }

    // Stockage token admin
    if (data.token) localStorage.setItem('adminToken', data.token);

    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// ------------------- GET ADMIN INFO -------------------
export const getAdmin = async (): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Admin non connecté');

    const response = await fetch(`${API_URL}/admin/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Impossible de récupérer les infos admin');
    }

    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// ------------------- CHECK ADMIN AUTH -------------------
export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('adminToken');
  return !!token; // renvoie true si token présent, false sinon
};