import api from "@/middleware/api";

export async function getAdsByUser(userId: string, last?: boolean) {
  try {
    const response = await api.get(`/ads/user/${userId}${last ? '/last' : ''}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar ads do Usuário:', error);
  }
}
