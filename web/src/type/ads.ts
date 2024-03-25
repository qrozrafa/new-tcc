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
  id:        string;
  name:      string;
  weekDay:   string[];
  hourStart: Date;
  hourEnd:   Date;
  useVoice:  boolean;
  useVideo:  boolean;
  linkCall:  string;
  status:    string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
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