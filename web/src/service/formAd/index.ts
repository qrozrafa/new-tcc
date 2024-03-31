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