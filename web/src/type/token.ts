export type UserToken = {
  id:    string;
  email: string;
  name:  string;
  role:  string;
  iat:   number;
  exp:   number;
  aud:   string;
  iss:   string;
  sub:   string;
}