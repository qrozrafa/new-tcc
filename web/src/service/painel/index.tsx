import api from "@/middleware/api";

export async function getAllAds() {
  try {
    const response = await api.get(`/subjects/all/ads`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar todos ads:', error);
  }
}
