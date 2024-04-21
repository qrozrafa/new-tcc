export type TAd = {
  id:         string;
  userId:     string;
  adId:       string;
  subjectId:  string;
  nameAd:     string;
  createdAt:  Date;
  updatedAt:  Date;
  deletedAt:  null;
  status:     string;
  detailUser: DetailUser;
  detailAd:   DetailAd;
}

export type DetailAd = {
  nameUser:  string;
  userId:    string;
  id:        string;
  adId:      string;
  subjectId: string;
  nameAd:    string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  status:    string;
  name:      string;
  weekDay:   string[];
  hourStart: Date;
  hourEnd:   Date;
  useVoice:  boolean;
  useVideo:  boolean;
  linkCall:  string;
}

export type DetailUser = {
  id:        string;
  name:      string;
  email:     string;
  cpf:       string;
  ra:        string;
  role:      string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  status:    string;
}

export type TOptions = {
  label: string;
  value: string;
}

export type TFormAd = {
  userId?:    string;
  subjectId: string;
  name:      string;
  weekDay:   string[];
  hourStart: Date;
  hourEnd:   Date;
  useVoice:  boolean;
  useVideo:  boolean;
  linkCall:  string;
}