export type TSubjects = {
  id:        string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  status:    string;
  countAds:  number;
}

export type ImageCard = 
|'Administração'
|'Física'
|'Matemática'
|'Linguagens'
|'Sociologia'
|'Engenharia'
|'Ed. Física'
|'Informática'
|'Geografia'
|'Biologia'
|'Química'
|'História';

export type TSubjectAds = {
  id:        string;
  adId:      string;
  subjectId: string;
  nameAd:    string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  status:    string;
}