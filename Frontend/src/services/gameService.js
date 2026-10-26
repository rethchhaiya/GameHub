const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function optimizedImageUrl(url, width = 600, height = 400) {
  if (!url) return url;
  return url.replace("/media/", `/media/crop/${width}/${height}/`);
}

export async function fetchGames(page) {
  const response = await fetch(`${API_BASE_URL}/games?page=${page}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch the games");
  }

  return {
    ...data,
    results: data.results.map((game) => ({
      ...game,
      background_image: optimizedImageUrl(game.background_image),
    })),
  };
    // return response.json();
}

export async function fetchGamesByName(name) {
  const response = await fetch(
    `${API_BASE_URL}/games-name?name=${encodeURIComponent(name)}`,
  );

  if (!response.ok) {
    throw new Error("Fetch is not successfull");
  }

  return response.json();
}

export async function fetchGameById(id) {
  const response = await fetch(`${API_BASE_URL}/games/${id}`);

  if (!response.ok) {
    throw new Error("Fail to fetch game by id");
  }

  return response.json();
}

export async function fetchGameScreenshots(id) {
  const response = await fetch(`${API_BASE_URL}/games/${id}/screenshots`);

  if (!response.ok) {
    throw new Error("Failed to fetch game screenshots");
  }

  return response.json();
}
