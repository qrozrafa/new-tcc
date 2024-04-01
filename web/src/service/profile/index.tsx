import api from "@/middleware/api";

export async function getAdsByUser(userId: string) {
  try {
    const response = await api.get(`/ads/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar ads do usuario:', error);
  }
}
