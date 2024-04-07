import api from "@/middleware/api";
import { DataEditUser, DataRegisterUser } from "@/type/register";

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
export async function editDataUser(id?: string, data?: DataEditUser) {
  try {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro durante a edição do perfil:', error);
  }
}
