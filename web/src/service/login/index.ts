import api from "@/middleware/api";
import { UserData } from "@/store/user";

export type LoginUser = {
  email: string;
  password: string;
}

export type Token = {
  access_token: string;
  user:  UserData;
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

export async function forgotPassword(email: string) {
  try {
    const response = await api.post('/email/forgot', { to: email });
    return response.data;
  } catch (error) {
    console.error('Erro durante o envio de email:', error);
  }
}