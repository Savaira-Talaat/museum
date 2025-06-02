import { API_URL } from "../constants";

export const advancedSearch = async (params: {
  q: string;
  hasImages?: boolean;
  isHighlight?: boolean;
  departmentId?: string;
  dateBegin?: string;
  dateEnd?: string;
}) => {
  const queryParams: Record<string, string> = {
    q: params.q || "*",
  };

  if (params.hasImages !== undefined) queryParams.hasImages = String(params.hasImages);
  if (params.isHighlight !== undefined) queryParams.isHighlight = String(params.isHighlight);
  if (params.departmentId) queryParams.departmentId = params.departmentId;
  if (params.dateBegin) queryParams.dateBegin = params.dateBegin;
  if (params.dateEnd) queryParams.dateEnd = params.dateEnd;

  const queryString = new URLSearchParams(queryParams).toString();

  const response = await fetch(`${API_URL}/search?${queryString}`);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.statusText}`);
  }

  const data = await response.json();

  return data.objectIDs || [];
};
