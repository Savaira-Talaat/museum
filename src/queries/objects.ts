import { API_URL } from "../constants";

export async function getAllObjectIDs() {
    const res = await fetch(`${API_URL}/objects`);
    const data = await res.json();
    if (!data.objectIDs) return [];
    return data.objectIDs as number[];
}

export async function getHighlightedObjects() {
    const res = await fetch(`${API_URL}/search?isHighlight=true&q=*`);
    const data = await res.json();
    if (!data.objectIDs) return [];

    const ids = data.objectIDs.slice(0, 15);

    const objects = await Promise.all(
        ids.map((id: any) =>
            fetch(`${API_URL}/objects/${id}`).then(r => r.json())
        )
    );

    return objects
        .filter(obj => obj.primaryImageSmall && obj.title)
        .map(obj => ({
            objectID: obj.objectID,
            primaryImageSmall: obj.primaryImageSmall,
            title: obj.title,
            artist: obj.artistDisplayName || "Auteur inconnu",
            date: obj.objectDate || obj.date || "Date inconnue",
        }));
}

export async function getObjectsByPage(pageSize: number, page: number, allObjectIDs: number[]) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageIDs = allObjectIDs.slice(start, end);

    const objects = await Promise.all(
        pageIDs.map(id =>
            fetch(`${API_URL}/objects/${id}`).then(r => r.json())
        )
    );

    return objects
        .filter(obj => obj.primaryImageSmall && obj.title)
        .map(obj => ({
            objectID: obj.objectID,
            primaryImageSmall: obj.primaryImageSmall,
            title: obj.title,
            artist: obj.artistDisplayName || "Auteur inconnu",
            date: obj.objectDate || obj.date || "Date inconnue",
        }));
}

export async function getObjectById(id: number | string) {
    const res = await fetch(`${API_URL}/objects/${id}`);
    if (!res.ok) throw new Error("Objet non trouvé");
    const obj = await res.json();
    return obj;
}