export type DataRegisterUser = {
  name: string
  email: string
  password?: string
  cpf: string
  ra: string
}
export type DataEditUser = {
  name?: string
  email?: string
  password?: string
  cpf?: string
  ra?: string
}

export type TResetPasswordUser = {
  password: string;
  token?: string | null;
}