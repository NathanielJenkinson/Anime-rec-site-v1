async function showRecommendations() {
  const genre = document.getElementById("genre-recommendations").value;
  const output = document.getElementById("recommendations-output");

  output.innerHTML = "Loading recommendations...";

  const query = `
    query ($genre: String!) {
      Page(page: 1, perPage: 6) {
        media(genre_in: [$genre], type: ANIME, sort: POPULARITY_DESC) {
          title {
            romaji
          }
          coverImage {
            medium
          }
        }
      }
    }
  `;

  const variables = { genre: genre };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    const animeList = data.data.Page.media;

    output.innerHTML = `<h3>${genre.toUpperCase()} Recommendations</h3><div class="anime-grid"></div>`;
    const grid = output.querySelector(".anime-grid");

    animeList.forEach(anime => {
      const card = document.createElement("div");
      card.classList.add("anime-card");
      card.innerHTML = `
        <img src="${anime.coverImage.medium}" alt="${anime.title.romaji}">
        <p>${anime.title.romaji}</p>
      `;
      grid.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    output.innerHTML = "An error occurred while fetching recommendations.";
  }
}
