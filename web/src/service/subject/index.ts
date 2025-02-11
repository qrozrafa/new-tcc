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

export async function getSubjectAds(subjectId: string, filter?: boolean) {
  try {
    const response = await api.get(`/subjects/ads/${filter ? 'last/' : ''}${subjectId}`);
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

export async function createSubject(data: any) {
  try {
    const response = await api.post(`/subjects`, data );
    return response.data;
  } catch (error) {
    console.error('Erro carregar o subject:', error);
  }
}

export async function uploadImage(subjectId?: string, data?: any) {
  try {
    const response = await api.post(`/subjects/image/${subjectId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } );
    return response.data;
  } catch (error) {
    console.error('Erro upload da image do subject:', error);
  }
}

export async function deleteImage(subjectId: string) {
  try {
    const response = await api.delete(`/subjects/image/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Erro deletar o image do subject:', error);
  }
}