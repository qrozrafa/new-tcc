import api from "../api";

export type LoginUser = {
  email: string;
  password: string;
}

export type Token = {
  access_token: string;
}

export async function login(crentials: LoginUser): Promise<Token | undefined> {
  try {
    const loginPayload = { ...crentials};
    const response = await api.post('/auth/login', loginPayload);
    return response.data;
  } catch (error) {
    console.error('Erro durante o login:', error);
  }
}