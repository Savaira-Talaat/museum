import { API_URL } from "../constants";

export interface MetObject {
  id: number;
  title: string;
  department: string;
  objectDate: string;
  image: string | null;
}

export interface AdvancedSearchParams {
  q: string;
  hasImages?: boolean;
  isHighlight?: boolean;
  departmentId?: string;
  dateBegin?: string;
  dateEnd?: string;
}

export const fetchDepartments = async () => {
  const response = await fetch(`${API_URL}/departments`);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erreur API départements : ${response.status} ${response.statusText} - Détails : ${errorBody}`);
  }
  const data = await response.json();
  return data.departments as { departmentId: number; displayName: string }[];
};

export const fetchObjectIds = async (params: AdvancedSearchParams): Promise<number[]> => {
  const queryParams: Record<string, string> = {
    q: params.q || "*",
  };

  if (params.hasImages) queryParams.hasImages = "true";
  if (params.isHighlight) queryParams.isHighlight = "true";
  if (params.departmentId) queryParams.departmentId = params.departmentId;
  if (params.dateBegin) queryParams.dateBegin = params.dateBegin;
  if (params.dateEnd) queryParams.dateEnd = params.dateEnd;

  const queryString = new URLSearchParams(queryParams).toString();
  const requestUrl = `${API_URL}/search?${queryString}`;

  console.log("URL de recherche avancée (IDs):", requestUrl);

  const response = await fetch(requestUrl);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erreur API de recherche IDs: ${response.status} ${response.statusText} - Détails: ${errorBody}`);
  }

  const data = await response.json();
  return data.objectIDs || [];
};

export const fetchObjectDetails = async (objectIds: number[]): Promise<MetObject[]> => {
    if (objectIds.length === 0) {
        return [];
    }

    const detailsPromises = objectIds.map(async (id) => {
        try {
            const res = await fetch(`${API_URL}/objects/${id}`);
            if (!res.ok) {
                console.error(`Erreur lors de la récupération de l'objet ${id}: ${res.status} ${res.statusText}`);
                return null; 
            }
            const data = await res.json();
            return {
                id: id,
                title: data.title || "Sans titre",
                department: data.department || "N/A",
                objectDate: data.objectDate || "N/A",
                image: data.primaryImageSmall || null,
            };
        } catch (e) {
            console.error(`Erreur inattendue lors de la récupération de l'objet ${id}:`, e);
            return null;
        }
    });

    const results = await Promise.all(detailsPromises);
    return results.filter(Boolean) as MetObject[];
};