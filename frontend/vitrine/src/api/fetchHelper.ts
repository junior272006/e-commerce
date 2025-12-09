// frontend/src/api/fetchHelper.ts

const TIMEOUT_MS = 45000; // 45 secondes (Render peut prendre jusqu'à 30-60s)

export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = TIMEOUT_MS
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(
        'Le serveur met trop de temps à répondre. ' +
        'Si c\'est votre première connexion, le serveur Render gratuit ' +
        'peut prendre jusqu\'à 1 minute à démarrer. Veuillez réessayer.'
      );
    }
    
    if (error.message === 'Failed to fetch') {
      throw new Error(
        '❌ Impossible de contacter le serveur. ' +
        'Vérifiez votre connexion internet ou réessayez dans quelques instants.'
      );
    }
    
    throw error;
  }
};