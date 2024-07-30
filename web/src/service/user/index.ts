import api from "@/middleware/api";
import { DataEditUser, DataRegisterUser, TResetPasswordUser} from "@/type/register";

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

export async function resetPasswordUser(data: TResetPasswordUser) {
  try {
    const response = await api.post(`/auth/reset`, data);
    return response.data;
  } catch (error) {
    console.error('Erro durante o reset de senha:', error);
  }
}

export async function getUsers() {
  try {
    const response = await api.get(`/users/all`);
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar usuarios:', error);
  }
}

export async function disableUser(userId: string) {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar usuario:', error);
  }
}

export async function activeUser(userId: string) {
  try {
    const response = await api.put(`/users/restore/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao ativar usuario:', error);
  }
}
