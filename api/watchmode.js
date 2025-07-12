/*fetch(`https://api.watchmode.com/v1/search/?apiKey=YOUR_KEY&search_field=name&search_value=${encodeURIComponent(title)}`)
  .then(res => res.json())
  .then(data => {
    const id = data.title_results[0]?.id;
    return fetch(`https://api.watchmode.com/v1/title/${id}/sources/?apiKey=RPA7MgAljnNq18ePUIuCT3puzLTWDiurWbtX6yZy`);
  })
  .then(res => res.json())
  .then(sources => {
    const netflix = sources.find(s => s.name === "Netflix");
    if (netflix) {
      const watchLink = netflix.web_url;
      // Use this instead of Google Search
    }
  });

*/
const TMDB_API_KEY = '5282ef7bfad6b493e7fb14dbc8b68474'; // Replace with your TMDb API key
const WATCHMODE_API_KEY = 'RPA7MgAljnNq18ePUIuCT3puzLTWDiurWbtX6yZy'; // Replace with your Watchmode API key
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1'; // const url = `https://api.watchmode.com/v1/sources/?apiKey=${apiKey}`;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

function showView(viewId) {
    document.querySelectorAll("#browseView, #moviesView, #seriesView").forEach(view => view.style.display = "none");
    document.getElementById(viewId).style.display = "block";
}

function loadMovies() {
    fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc`)
        .then(res => res.json())
        .then(data => renderCards(data.results, 'moviesList'));
}

function loadSeries() {
    fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc`)
        .then(res => res.json())
        .then(data => renderCards(data.results, 'seriesList'));
}

function searchContent(query) {
    fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => renderCards(data.results, 'searchResults'));
}

/*
function initFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title');
            const poster = btn.getAttribute('data-poster');

            if (isItemInFavorites(id)) {
                removeFromFavorites(id);
            } else {
                addToFavorites({ id, title, poster });
            }

            showFavorites(); // refresh list if needed
            btn.textContent = isItemInFavorites(id) ? 'Remove from Favorites' : 'Add to Favorites';
            btn.classList.toggle('btn-outline-warning');
            btn.classList.toggle('btn-danger');
        };
    });
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("streamate_favorites") || "[]");
}

function saveFavorites(favs) {
    localStorage.setItem("streamate_favorites", JSON.stringify(favs));
}

function addToFavorites(item) {
    const favs = getFavorites();
    if (!favs.some(f => f.id === item.id)) {
        favs.push(item);
        saveFavorites(favs);
    }
}

function removeFromFavorites(id) {
    let favs = getFavorites();
    favs = favs.filter(item => item.id !== id);
    saveFavorites(favs);
}

function isItemInFavorites(id) {
    return getFavorites().some(item => item.id === id);
}

function showFavorites() {
    showView('favoritesView');
    const favs = getFavorites();
    const container = document.getElementById('favoritesList');
    container.innerHTML = favs.length === 0 ? '<p>No favorites yet.</p>' : '';

    favs.forEach(item => {
        container.innerHTML += `
        <div class="col-md-3">
            <div class="card h-100 shadow">
                <img src="${item.poster}" class="card-img-top" alt="${item.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.title}</h5>
                    <button class="btn btn-danger btn-sm mt-auto" onclick="removeFromFavorites('${item.id}'); showFavorites();">
                        Remove
                    </button>
                </div>
            </div>
        </div>`;
    });
}
*/
function initFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const title = btn.dataset.title;
            const poster = btn.dataset.poster;

            if (isItemInFavorites(id)) {
                removeFromFavorites(id);
            } else {
                addToFavorites({ id, title, poster });
            }

            // Update UI
            btn.textContent = isItemInFavorites(id) ? 'Remove from Favorites' : 'Add to Favorites';
            btn.classList.toggle('btn-danger');
            btn.classList.toggle('btn-outline-warning');
        };
    });
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("streamate_favorites") || "[]");
}

function saveFavorites(favs) {
    localStorage.setItem("streamate_favorites", JSON.stringify(favs));
}

function addToFavorites(item) {
    const favs = getFavorites();
    if (!favs.some(f => f.id === item.id)) {
        favs.push(item);
        saveFavorites(favs);
    }
}

function removeFromFavorites(id) {
    const favs = getFavorites().filter(f => f.id !== id);
    saveFavorites(favs);
}

function isItemInFavorites(id) {
    return getFavorites().some(f => f.id == id);
}

function showFavorites() {
    showView('favoritesView');
    const favs = getFavorites();
    const container = document.getElementById('favoritesList');
    container.innerHTML = favs.length === 0 ? '<p>No favorites yet.</p>' : '';

    favs.forEach(item => {
        container.innerHTML += `
        <div class="col-md-3">
            <div class="card h-100 shadow">
                <img src="${item.poster}" class="card-img-top" alt="${item.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.title}</h5>
                    <button class="btn btn-danger btn-sm mt-auto" onclick="removeFromFavorites('${item.id}'); showFavorites();">
                        Remove
                    </button>
                </div>
            </div>
        </div>`;
    });
}

/*
function renderCards(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(async (item) => {
        const title = item.title || item.name || 'Untitled';
        const poster = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        const overview = item.overview ? item.overview.substring(0, 120) + '…' : 'No description available';

        // Search Watchmode for streaming info
        let watchLink = '';
        try {
            const searchRes = await fetch(`https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(title)}`);
            const searchData = await searchRes.json();
            const id = searchData.title_results[0]?.id;

            if (id) {
                const sourcesRes = await fetch(`https://api.watchmode.com/v1/title/${id}/sources/?apiKey=${WATCHMODE_API_KEY}`);
                const sources = await sourcesRes.json();
                const mainSource = sources.find(s => ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max'].includes(s.name));
                if (mainSource) {
                    watchLink = mainSource.web_url;
                }
            }
        } catch (error) {
            console.error("Watchmode API error:", error);
        }

        const watchNowHTML = watchLink 
            ? `<a href="${watchLink}" class="btn btn-outline-primary mt-auto" target="_blank">Watch Now</a>`
            : `<a href="https://www.google.com/search?q=watch+${encodeURIComponent(title)}+online" class="btn btn-outline-secondary mt-auto" target="_blank">Search</a>`;

        const isFavorite = isItemInFavorites(id);
        
        container.innerHTML += `
        <div class="col-md-3">
            <div class="card h-100 shadow">
                <img src="${poster}" class="card-img-top" alt="${title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${overview}</p>
                    ${watchNowHTML}
                    <button class="btn ${isFavorite ? 'btn-danger' : 'btn-outline-warning'} btn-sm mt-2 favorite-btn"
                            data-id="${id}" data-title="${title}" data-poster="${poster}">
                        ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        </div>`;
    });

    setTimeout(initFavoriteButtons, 300); // Ensure DOM is rendered before attaching
} */

function renderCards(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(async (item) => {
        const id = item.id;
        const title = item.title || item.name || 'Untitled';
        const poster = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        const overview = item.overview ? item.overview.substring(0, 120) + '…' : 'No description available';

        let watchLink = '';
        try {
            const searchRes = await fetch(`https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(title)}`);
            const searchData = await searchRes.json();
            const tmdbId = searchData.title_results[0]?.id;
            if (tmdbId) {
                const sourcesRes = await fetch(`https://api.watchmode.com/v1/title/${tmdbId}/sources/?apiKey=${WATCHMODE_API_KEY}`);
                const sources = await sourcesRes.json();
                const mainSource = sources.find(s => ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max'].includes(s.name));
                if (mainSource) {
                    watchLink = mainSource.web_url;
                }
            }
        } catch (e) {
            console.warn("Watchmode error:", e);
        }

        const isFavorite = isItemInFavorites(id);
        const watchBtn = watchLink
            ? `<a href="${watchLink}" class="btn btn-outline-primary btn-sm mt-2" target="_blank">Watch Now</a>`
            : `<a href="https://www.google.com/search?q=watch+${encodeURIComponent(title)}+online" class="btn btn-outline-secondary btn-sm mt-2" target="_blank">Search</a>`;

        const favBtn = `
            <button class="btn ${isFavorite ? 'btn-danger' : 'btn-outline-warning'} btn-sm mt-2 favorite-btn"
                data-id="${id}" data-title="${title}" data-poster="${poster}">
                ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>`;

        container.innerHTML += `
        <div class="col-md-3">
            <div class="card h-100 shadow-sm">
                <img src="${poster}" class="card-img-top" alt="${title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${overview}</p>
                    <div class="d-grid gap-2">
                        ${watchBtn}
                        ${favBtn}
                    </div>
                </div>
            </div>
        </div>`;
    });

    setTimeout(initFavoriteButtons, 300); // Allow async rendering to complete before binding events
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#menu-browse").addEventListener("click", () => {
        showView('browseView');
        document.getElementById('searchResults').innerHTML = ''; // clear previous
    });

    document.querySelector("#menu-movies").addEventListener("click", () => {
        showView('moviesView');
        loadMovies();
    });

    document.querySelector("#menu-series").addEventListener("click", () => {
        showView('seriesView');
        loadSeries();
    });

    document.getElementById("menu-favorites").addEventListener("click", () => {
    showFavorites();
    });

    //document.querySelector("#browseView button").addEventListener("click", () => {
    //    const query = document.querySelector("#browseView input").value;
    //    if (query.trim() !== '') {
    //        searchContent(query);
    //    }
    //});

    // FIXED: Search Button Handler
    document.getElementById("searchBtn").addEventListener("click", () => {
        const query = document.getElementById("searchInput").value.trim();
        if (query !== '') {
            searchContent(query);
        }
    });

    // Optional: Trigger search on Enter key
    document.getElementById("searchInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            document.getElementById("searchBtn").click();
        }
    });
});

