import { API_URL } from "../constants";

export const quickSearch = async (query: string): Promise<any[]> => {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  const data = await res.json();

  if (!data.objectIDs || data.objectIDs.length === 0) return [];

  const limitedIds = data.objectIDs.slice(0, 5);

  const details = await Promise.all(
    limitedIds.map(async (id: any) => {
      const res = await fetch(`${API_URL}/objects/${id}`);
      const objectData = await res.json();
      return {
        id,
        title: objectData.title,
        image: objectData.primaryImageSmall,
      };
    })
  );

  return details;
};
