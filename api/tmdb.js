// File: web/V1/api/tmdb.js
// This file contains the API integration for The Movie Database (TMDB)
const TMDB_API_KEY = '5282ef7bfad6b493e7fb14dbc8b68474'; // Replace with your key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

// Show view
function showView(viewId) {
    document.querySelectorAll("#browseView, #moviesView, #seriesView").forEach(view => view.style.display = "none");
    document.getElementById(viewId).style.display = "block";
}

// Load Movies
function loadMovies() {
    fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc`)
        .then(res => res.json())
        .then(data => renderCards(data.results, 'moviesList'));
}

// Load Series
function loadSeries() {
    fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc`)
        .then(res => res.json())
        .then(data => renderCards(data.results, 'seriesList'));
}

// Search Functionality
function searchContent(query) {
    fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => renderCards(data.results, 'searchResults'));
}

// Render Cards
function renderCards(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const title = item.title || item.name || 'Untitled';
        const poster = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        const overview = item.overview ? item.overview.substring(0, 120) + '…' : 'No description available';
        const externalSearch = `https://www.google.com/search?q=watch+${encodeURIComponent(title)}+online`;

        container.innerHTML += `
        <div class="col-md-3">
            <div class="card h-100 shadow">
                <img src="${poster}" class="card-img-top" alt="${title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${overview}</p>
                    <a href="${externalSearch}" class="btn btn-outline-primary mt-auto" target="_blank">
                        Watch Now
                    </a>
                </div>
            </div>
        </div>`;
    });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#menu-browse").addEventListener("click", () => {
        showView('browseView');
    });

    document.querySelector("#menu-movies").addEventListener("click", () => {
        showView('moviesView');
        loadMovies();
    });

    document.querySelector("#menu-series").addEventListener("click", () => {
        showView('seriesView');
        loadSeries();
    });

    // Search button
    document.querySelector("#browseView button").addEventListener("click", () => {
        const query = document.querySelector("#browseView input").value;
        if (query.trim() !== '') {
            searchContent(query);
        }
    });
});


