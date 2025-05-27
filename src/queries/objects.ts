import { API_URL } from "../constants"

export async function getAllObjects() {
    const response = fetch(`${API_URL}/objects`)
    return (await response).json()
}

export async function getHighlightedObjects() {
    const objectsIds = await getAllObjects();
    let count = 0;
    const highlightedObjects = [];
    for (let id in objectsIds?.objectIDs) {
        if (count > 100) {
            break;
        }
        const response = await fetch(`${API_URL}/objects/${id}`);
        const body = await response.json();
        body.isHighlight && highlightedObjects.push(body);
        count++;
    }

    return highlightedObjects;
}