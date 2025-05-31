const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

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
        }));
}