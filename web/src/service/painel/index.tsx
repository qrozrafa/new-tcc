import api from "@/middleware/api";

export async function getAllAds(last?: boolean) {
  try {
    const response = await api.get(`/subjects/all/ads${last ? '/last' : ''}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar todos ads:', error);
  }
}
