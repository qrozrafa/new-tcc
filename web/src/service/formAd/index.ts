import api from "@/middleware/api";
import { TFormAd } from "@/type/ads";

export async function createAd(data: TFormAd) {
  try {
    const response = await api.post('/ads', data);
    return response.data;
  } catch (error) {
    console.error('Erro durante o cadastro de ad:', error);
  }
}
export async function updateAd(id: string, data: TFormAd) {
  try {
    const response = await api.put(`/ads/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro durante o edição de ad:', error);
  }
}

export async function deleteAd(id: string) {
  try {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro durante o exclusao de ad:', error);
  }
}