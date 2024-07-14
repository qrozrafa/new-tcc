import api from "@/middleware/api";

export async function getSubjects() {
  try {
    const response = await api.get('/subjects');
    return response.data;
  } catch (error) {
    console.error('Erro carregar os subjects:', error);
  }
}

export async function getAllSubjects() {
  try {
    const response = await api.get('/subjects/all');
    return response.data;
  } catch (error) {
    console.error('Erro carregar os subjects:', error);
  }
}

export async function getSubjectAds(subjectId: string) {
  try {
    const response = await api.get(`/subjects/ads/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar os ads de subject:', error);
  }
}
export async function getSubject(subjectId: string) {
  try {
    const response = await api.get(`/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar o subject:', error);
  }
}

export async function disableSubject(subjectId: string) {
  try {
    const response = await api.delete(`/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar o subject:', error);
  }
}
export async function activeSubject(subjectId: string) {
  try {
    const response = await api.put(`/subjects/restore/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Erro carregar o subject:', error);
  }
}

export async function editSubject(subjectId: string, data: any) {
  try {
    const response = await api.put(`/subjects/${subjectId}`, data );
    return response.data;
  } catch (error) {
    console.error('Erro carregar o subject:', error);
  }
}