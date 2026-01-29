async function showRecommendations() {
  // Get the value the user selected from the dropdown
  const selected = document.getElementById("genre-recommendations").value;

  // This is the div where results will be displayed
  const output = document.getElementById("recommendations-output");

  // Let the user know something is happening while we fetch data
  output.innerHTML = "Loading recommendations...";

  // AniList treats "Isekai" as a TAG, not a genre
  const isIsekai = selected === "isekai";

  // AniList genre names are case-sensitive (e.g., "Slice of Life")
  const normalizedGenre =
    selected === "slice of life"
      ? "Slice of Life"
      : selected.charAt(0).toUpperCase() + selected.slice(1);

  // GraphQL query string (IMPORTANT: no // comments allowed inside here or it breaks)
  // We swap between tag_in and genre_in depending on isekai
  const query = `
    query ($filter: [String!]) {
      Page(page: 1, perPage: 6) {
        media(
          ${isIsekai ? "tag_in: $filter" : "genre_in: $filter"},
          type: ANIME,
          sort: POPULARITY_DESC
        ) {
          title { romaji }
          coverImage { medium }
        }
      }
    }
  `;

  // Variables must match the query type: [String!]
  const variables = {
    filter: [isIsekai ? "Isekai" : normalizedGenre]
  };

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

    // GraphQL can return errors even when HTTP is 200
    if (!response.ok || data.errors) {
      console.error("AniList error:", data.errors || response.statusText);
      output.innerHTML = "AniList returned an error. Check the console.";
      return;
    }

    const animeList = data.data.Page.media;

    if (!animeList || animeList.length === 0) {
      output.innerHTML = `No results found for ${isIsekai ? "Isekai" : normalizedGenre}.`;
      return;
    }

    output.innerHTML = `
      <h3>${isIsekai ? "Isekai" : normalizedGenre} Recommendations</h3>
      <div class="anime-grid"></div>
    `;

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

function setTheme(themeFromUser) {
  // If user picked one, use it. Otherwise load saved value.
  const theme = themeFromUser || localStorage.getItem("theme") || "csm";

  // Apply to BODY because CSS uses body
  document.body.setAttribute("data-theme", theme);

  // Saves choice
  localStorage.setItem("theme", theme);

  // Sync dropdown if it exists
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) themeSelect.value = theme;
}

document.addEventListener("DOMContentLoaded", () => {
  setTheme(); // loads saved theme on every page
});

async function loadAnimeList(mode) {
  const output = document.getElementById("recommendations-output");
  if (!output) return;

  output.innerHTML = "Loading...";

  // Map each page/button to an AniList sort mode
  const sortMap = {
    popular: "POPULARITY_DESC",
    top_rated: "SCORE_DESC",
    trending: "TRENDING_DESC",
    newest: "START_DATE_DESC"
  };

  const sort = sortMap[mode] || "POPULARITY_DESC";

  const query = `
    query ($sort: [MediaSort]) {
      Page(page: 1, perPage: 12) {
        media(type: ANIME, sort: $sort) {
          title { romaji }
          coverImage { medium }
        }
      }
    }
  `;

  const variables = { sort: [sort] };

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ query, variables })
    });

    const data = await res.json();

    if (!res.ok || data.errors) {
      console.error(data.errors || res.statusText);
      output.innerHTML = "AniList error (check console).";
      return;
    }

    const animeList = data.data.Page.media;

    output.innerHTML = `<h3>${mode.replace("_", " ").toUpperCase()}</h3><div class="anime-grid"></div>`;
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

  } catch (e) {
    console.error(e);
    output.innerHTML = "Network error (check console).";
  }
}
