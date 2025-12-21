//You can edit ALL of the code here

// create global state.
const showsEndpoint = "https://api.tvmaze.com/shows";
let currentEpisodes = [];

let episodesCache = {};
let showCache = null; //to test whether to fetch or not

async function fetchShows() {
  if (showCache) {
    return showCache;
  }

  const response = await fetch(showsEndpoint);

  if (!response.ok) {
    throw new Error("SHOW_FETCH_ERROR");
  }

  const shows = await response.json();
  showCache = shows;
  return shows;
}

function sortShowsAlphabetically(shows) {
  return shows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
}

async function loadShows() {
  try {
    showLoading("Loading shows...");

    const shows = await fetchShows();
    const sortedShows = sortShowsAlphabetically(shows);

    renderShows(sortedShows);

  } catch (error) {
    showError("Could not load shows. Please refresh the page.");
    console.error(error);
  } finally {
    hideLoading();
  }
}

function showLoading(message) {
  const loadingDiv = document.getElementById("loading");
  loadingDiv.textContent = message;
  loadingDiv.classList.remove("hidden");
}

function hideLoading() {
  const loadingDiv = document.getElementById("loading");
  loadingDiv.classList.add("hidden");
}

function showError(message) {
  const errorDiv = document.getElementById("error");

  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  const errorDiv = document.getElementById("error");
  errorDiv.classList.add("hidden");
}

function resetSearchInput() {
  const input = document.getElementById("searchBox");
  if (input) input.value = "";
}


async function fetchEpisodes(showId) {
  if (episodesCache[showId]) {
    return episodesCache[showId];
  }

  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );

  if (!response.ok) {
    throw new Error("EPISODE_FETCH_ERROR");
  }

  const episodes = await response.json();
  episodesCache[showId] = episodes;

  return episodes;
}

// create render function 

function renderShows(shows) {
  const showsView = document.getElementById("shows-view");
  showsView.innerHTML = "";

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";

    card.innerHTML = `
      <h2>${show.name}</h2>
      <img src="${show.image?.medium || ""}" alt="${show.name}">
      <div class="summary">${show.summary || "No summary available"}</div>
      <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${show.rating.average ?? "N/A"}</p>
      <p><strong>Runtime:</strong> ${show.runtime ?? "N/A"} minutes</p>
    `;

    card.addEventListener("click", () => {
  loadEpisodesForShow(show.id);
});

    showsView.appendChild(card);
  });
}

// create load episodes function

async function loadEpisodesForShow(showId) {
  try {
    showLoading("Loading episodes...");

    const episodes = await fetchEpisodes(showId);
    currentEpisodes = episodes;

    document.getElementById("shows-view").classList.add("hidden");
    document.getElementById("episodes-view").classList.remove("hidden");

    makePageForEpisodes(episodes);
    setupSearch();
  } catch (error) {
    showError("Could not load episodes. Please try again.");
    console.error(error);
  } finally {
    hideLoading();
  }
}



// Update the setup function to use fetch with async/wait

async function setup() {
  const bodyElem = document.querySelector("body");

  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";

  const errorDiv = document.createElement("div");
  errorDiv.id = "error";

  bodyElem.append(loadingDiv, errorDiv);

  const shows = sortShowsAlphabetically(await fetchShows());

  createShowSelect();
  populateShowsList(shows);
  setupShowSearch(shows);       // dropdown filtering
  setupShowCardSearch(shows);  //  NEW — card filtering
  selectShow();

  await loadShows();
}


function setupShowCardSearch(shows) {
  const input = document.getElementById("showSearch");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    const filteredShows = shows.filter(show =>
      show.name.toLowerCase().includes(query)
    );

    renderShows(filteredShows);
  });
}






function setupSearch() {
  const searchBox = document.getElementById("searchBox");
  const searchString = document.getElementById("searchString");

  if (!searchBox || !searchString) {
    console.error("Search box or search string element is missing.");
    return;
  }

  searchBox.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    let count = 0;

    const episodes = document.querySelectorAll(".episode-card");

    episodes.forEach((episode) => {
      const title =
        episode.querySelector("h3")?.textContent.toLowerCase() || "";
      const summary =
        episode.querySelector(".summary")?.textContent.toLowerCase() || "";

      if (title.includes(query) || summary.includes(query)) {
        episode.style.display = "block";
        count++;
      } else {
        episode.style.display = "none";
      }
    });

    searchString.textContent = `Displaying ${count}/${currentEpisodes.length} episodes`;
  });

  if (!document.querySelector("#dropDownList")) {
    
  }

  const selectElement = document.querySelector("#dropDownList");
if (selectElement) {
  selectElement.addEventListener("change", selectEpisode);
}

}

window.onload = setup;

function makePageForEpisodes(episodeList) {
  // 1. Get the root container FIRST
  const rootElem = document.getElementById("episodes-view");
  rootElem.innerHTML = "";

  // 2. Back to Shows button
  const backButton = document.createElement("button");
  backButton.textContent = "← Back to Shows";
  backButton.id = "back-to-shows";

  backButton.addEventListener("click", () => {
    document.getElementById("episodes-view").classList.add("hidden");
    document.getElementById("shows-view").classList.remove("hidden");
  });

  rootElem.appendChild(backButton);

  // 3. Search UI
  const search = document.createElement("div");
  search.id = "search";
  search.innerHTML = `
    <label>
      Search:
      <input id="searchBox" type="text" />
    </label>
    <span id="searchString"></span>
  `;
  rootElem.appendChild(search);
  selectList();

  // 4. Episodes list
  episodeList.forEach((episode) => {
  const card = document.createElement("div");
  card.className = "episode-card";

  const episodeCode = `S${episode.season
    .toString()
    .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

  card.dataset.id = episodeCode;


    card.innerHTML = `
      <h3>${episode.name} - ${episodeCode}</h3>
      <img src="${episode.image?.medium || ""}" alt="${episode.name}">
      <div class="summary">${episode.summary || ""}</div>
      <a href="${episode.url}" target="_blank">View on TVMaze</a>
    `;

    rootElem.appendChild(card);
  });

  // 5. Attribution
  const attribution = document.createElement("p");
  attribution.className = "attribution";
  attribution.innerHTML = `
    Data originally from 
    <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>
  `;

  rootElem.appendChild(attribution);
}


function selectList() {
  // we start by creating the select element to attach the options to.
  //    we use a for each loop to create the options abd attach them to the select element
  const displayArea = document.querySelector("#search");

  const selectLabel = document.createElement("label");
  selectLabel.setAttribute("for", "dropDownList");
  selectLabel.innerText = "Select episode: ";

  const selectBox = document.createElement("select");
  selectBox.setAttribute("name", "episode-list");
  selectBox.setAttribute("id", "dropDownList");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerText = "--All Episodes--";

  selectLabel.appendChild(selectBox);

  selectBox.appendChild(defaultOption);

  displayArea.append(selectLabel);

  currentEpisodes.forEach((episode) => {
  const episodeCode = `S${episode.season
    .toString()
    .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

  const episodeName = `${episodeCode} - ${episode.name}`;

  const episodeOption = document.createElement("option");
  episodeOption.value = episodeCode;      //  matches dataset.id
  episodeOption.innerText = episodeName;  // nice label

  selectBox.appendChild(episodeOption);
});

}

function selectEpisode(event) {
  const selectedId = event.target.value;

  const cards = document.querySelectorAll(".episode-card");

  cards.forEach(card => {
    if (!selectedId) {
      card.style.display = "block";
      return;
    }

    const id = card.dataset.id;
    card.style.display = id === selectedId ? "block" : "none";
  });
}


function rearrangeName(episode) {
  let nameArray = episode.split("-");
  return `${nameArray[1]} - ${nameArray[0]}`;
}

function createShowSelect() {
  const showsView = document.getElementById("shows-view");

  const container = document.createElement("div");
  container.id = "show-container";

  // show search input
  const input = document.createElement("input");
  input.type = "text";
  input.id = "showSearch";
  input.placeholder = "Search shows...";

  // show dropdown
  const select = document.createElement("select");
  select.id = "showDropDownList";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "--All Shows--";

  select.appendChild(defaultOption);

  container.append(input, select);

  // insert ABOVE the shows list
  showsView.parentNode.insertBefore(container, showsView);
}




function populateShowsList(shows) {
  const selectBox = document.querySelector("#showDropDownList");
  if (!selectBox) return;

  selectBox.innerHTML = '<option value="">--All Shows--</option>';

  const sortedShows = sortShowsAlphabetically(shows); // ensure sorted

  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selectBox.appendChild(option);
  });
}

function setupShowSearch(shows) {
  const input = document.getElementById("showSearch");
  const select = document.getElementById("showDropDownList");

  if (!input || !select) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    select.innerHTML = '<option value="">--All Shows--</option>';

    shows
      .filter(show => show.name.toLowerCase().includes(query))
      .forEach(show => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        select.appendChild(option);
      });
  });
}



function selectShow() {
  document
    .getElementById("showDropDownList")
    .addEventListener("change", async (e) => {
      const showId = e.target.value;
      if (!showId) return;

      try {
        showLoading("Loading episodes...");

        const episodes = await fetchEpisodes(showId);
        currentEpisodes = episodes;

        document.getElementById("shows-view").classList.add("hidden");
        document.getElementById("episodes-view").classList.remove("hidden");

        makePageForEpisodes(episodes);
        setupSearch();
        resetSearchInput();
      } catch (error) {
        showError("Could not load episodes. Please try again.");
        console.error(error);
      } finally {
        hideLoading();
      }
    });
}


