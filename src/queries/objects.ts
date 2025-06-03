import { API_URL } from "../constants";

export async function getHighlightedObjects() {
    const res = await fetch(`${API_URL}/search?isHighlight=true&q=*`);
    const data = await res.json();
    if (!data.objectIDs) return [];

    const ids = data.objectIDs.slice(0, 15);

    const objects = await Promise.all(
        ids.map(id =>
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

export async function getRandomObjects(count = 8) {
    const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
    const res = await fetch(`${API_URL}/objects`);
    const data = await res.json();
    if (!data.objectIDs) return [];

    const shuffled = [...data.objectIDs].sort(() => 0.5 - Math.random());
    const ids = shuffled.slice(0, Math.max(50, count * 5));

    const objects = await Promise.all(
        ids.map(id =>
            fetch(`${API_URL}/objects/${id}`).then(r => r.json())
        )
    );

    return objects
        .filter(obj => obj.primaryImageSmall && obj.title)
        .slice(0, count)
        .map(obj => ({
            objectID: obj.objectID,
            primaryImageSmall: obj.primaryImageSmall,
            title: obj.title,
            artist: obj.artistDisplayName || "Auteur inconnu",
            date: obj.objectDate || obj.date || "Date inconnue",
        }));
}