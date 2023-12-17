import { DataRegisterUser } from "@/type/register";
import api from "../api";

export async function getDataUserToken() {
  try {
    const response = await api.post('/auth/check');
    return response.data;
  } catch (error) {
    console.error('Erro carregar chamada check auth:', error);
  }
}

export async function createUser(data: DataRegisterUser) {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Erro durante o cadastro:', error);
  }
}