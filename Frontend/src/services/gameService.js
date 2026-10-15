const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchGames() {
    const response = await fetch(`${API_BASE_URL}/games`);

    if(!response.ok){
        throw new Error("Failed to fetch the games");
    }
    
    return response.json();
}

export async function fetchGamesByName(name) {
    const response = await fetch(`${API_BASE_URL}/games-name?name=${encodeURIComponent(name)}`);

    if(!response.ok){
        throw new Error("Fetch is not successfull");
    }

    return response.json();
}

export async function fetchGameById(id) {
    const response = await fetch(`${API_BASE_URL}/games/${id}`)

    if(!response.ok){
        throw new Error("Fail to fetch game by id");
    }

    return response.json();
    
}

export async function fetchGameScreenshots(id) {
    const response = await fetch(`${API_BASE_URL}/games/${id}/screenshots`);

    if(!response.ok){
        throw new Error("Failed to fetch game screenshots")
    }
    
    return response.json();
}