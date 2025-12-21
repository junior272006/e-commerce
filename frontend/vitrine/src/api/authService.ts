// frontend/src/api/authService.ts
import { fetchWithTimeout } from './fetchHelper';

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

export interface MessageData {
  _id?:string;
  name: string;
  email: string;
  sujet: string;
  message: string;
}

export interface ProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];  
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
  id?: string;
  email?: string;
  product:string
}

// ------------------- WAKE UP SERVER -------------------
export const wakeUpServer = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/health`,
      { method: 'GET' },
      10000 // 10 secondes seulement pour le health check
    );
    return response.ok;
  } catch (error) {
    console.warn('⏳ Serveur en démarrage...');
    return false;
  }
};

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
    };

    const response = await fetchWithTimeout(
      `${API_URL}/user/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datasig)
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur inscription');
    }

    return data;
  } catch (error: any) {
    console.error(' Erreur registerUser:', error);
    throw error;
  }
};

// ------------------- LOGIN USER -------------------
export const loginUser = async (loginData: LoginData): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/user/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur de connexion');
    }

    // Stockage du token utilisateur
    if (data.token) {
      localStorage.setItem('userToken', data.token);
      if (data.id) localStorage.setItem('userId', data.id);
      if (data.email) localStorage.setItem('userEmail', data.email);
    }

    return data;
  } catch (error: any) {
    console.error(' Erreur loginUser:', error);
    throw error;
  }
};

// ------------------- GET USER INFO -------------------
export const getUser = async (): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('Utilisateur non connecté');

    const response = await fetchWithTimeout(
      `${API_URL}/user/me`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Impossible de récupérer les infos utilisateur');
    }

    return data;
  } catch (error: any) {
    console.error(' Erreur getUser:', error);
    throw error;
  }
};

// ------------------- CHECK USER AUTH -------------------
export const isUserAuthenticated = (): boolean => {
  const token = localStorage.getItem('userToken');
  return !!token;
};

// ------------------- LOGIN ADMIN -------------------
export const loginAdmin = async (loginData: LoginData): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/admin/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur login admin');
    }

    // Stockage token admin
    if (data.token) localStorage.setItem('adminToken', data.token);

    return data;
  } catch (error: any) {
    console.error(' Erreur loginAdmin:', error);
    throw error;
  }
};

// ------------------- GET ADMIN INFO -------------------
export const getAdmin = async (): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Admin non connecté');

    const response = await fetchWithTimeout(
      `${API_URL}/admin/me`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Impossible de récupérer les infos admin');
    }

    return data;
  } catch (error: any) {
    console.error(' Erreur getAdmin:', error);
    throw error;
  }
};

// ------------------- CHECK ADMIN AUTH -------------------
export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// ------------------- ENVOI MESSAGE -------------------
export const message = async (messageData: MessageData): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/message`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erreur lors de l\'envoi du message');
    }

    return data;
  } catch (error: any) {
    console.error(' Erreur message:', error);
    throw error;
  }
};

// ------------------- LISTE UTILISATEURS -------------------
export const userlist = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error("Admin non connecté");

    const response = await fetchWithTimeout(
      `${API_URL}/user/liste`,
      {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || data.message || "Erreur récupération utilisateurs");
    }

    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error(' Erreur userlist:', error);
    throw error;
  }
};

export const usermessage = async (): Promise<MessageData[]> => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || data.message || "Erreur récupération messages");
    }

    const data: MessageData[] = await response.json();
    return data;
  } catch (error: any) {
    console.error(' Erreur usermessage:', error);
    throw error;
  }
};
// ------------------- ENREGISTREMENT PRODUIT -----------------
export const createproduct = async (
  productData: ProductData
): Promise<ApiResponse> => {
  try {
    console.log(' Création produit:', productData);

    const formData = new FormData();

    // Ajout des données texte
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('category', productData.category);
    formData.append('stock', productData.stock.toString());

    // Ajout des images
    if (productData.images?.length) {
      console.log(` Ajout de ${productData.images.length} image(s)`);
      productData.images.forEach((file, index) => {
        console.log(`Image ${index + 1}:`, file.name, file.type, file.size);
        formData.append('images', file);
      });
    } else {
      console.warn(' Aucune image fournie');
    }

    // Log pour debug
    console.log('🔗 URL appelée:', `${API_URL}/product/`);

    // IMPORTANT: NE PAS mettre Content-Type avec FormData
    // Le navigateur le gère automatiquement avec la bonne boundary
    const response = await fetch(`${API_URL}/product/`, {
      method: 'POST',
      body: formData,
      // Pas de headers ! Le navigateur gère automatiquement
    });

    console.log(' Statut de la réponse:', response.status);

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      console.error(' Erreur serveur:', data);
      throw new Error(data.message || data.error || 'Erreur création produit');
    }

    console.log(' Produit créé avec succès:', data);
    return data;

  } catch (error: any) {
    console.error(' Erreur création produit:', error);
    throw error;
  }
};

// ------------------- LISTE PRODUITS -----------------
export const productlist = async (): Promise<any[]> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/product/liste`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || "Erreur récupération produits");
    }

    console.log(' Produits récupérés:', data.length);
    return data;

  } catch (error: any) {
    console.error(' Erreur productlist:', error);
    throw error;
  }
};

//-----------------------SUPPRESSION PRODUIT------------------

export const DeleteProduct = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/product/delete`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      }
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Erreur lors de la suppression");
    }

    return data;
  } catch (error: any) {
    console.error('Erreur DeleteProduct:', error);
    throw error;
  }
};