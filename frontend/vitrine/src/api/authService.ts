const API_URL = 'https://e-commerce-3-clba.onrender.com/api';

// ✅ TYPES DÉFINIS
interface UserData {
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

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export const registerUser = async (userData: UserData): Promise<ApiResponse> => {
  try {
    const dataToSend = {
      firstname: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      shopName: userData.shopName || '',
      siret: userData.siret || '',
      address: userData.address || '',
    };


    const response = await fetch(`${API_URL}/admin/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const data: ApiResponse = await response.json();
    console.log( data);

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur inscription');
    }

    return data;

  } catch (error) {
    console.error( error);
    throw error;
  }
};