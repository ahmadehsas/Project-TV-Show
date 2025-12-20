//You can edit ALL of the code here

// create global state.
const showsEndpoint = "https://api.tvmaze.com/shows";
let currentEpisodes = [];
let Shows = [];
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
  document.getElementById("searchBox").value = "";
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
      console.log("Show clicked:", show.id);
    });

    showsView.appendChild(card);
  });
}


// Update the setup function to use fetch with async/wait

async function setup() {
  const bodyElem = document.querySelector("body");

  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";

  const errorDiv = document.createElement("div");
  errorDiv.id = "error";

  bodyElem.append(loadingDiv, errorDiv);

  await loadShows(); // ONLY load shows on start
}


// async function setup() {
//   const rootElem = document.getElementById("root");
//   const loadingDiv = document.createElement("div");
//   const errorDiv = document.createElement("div");
//   errorDiv.setAttribute("id", "error");
//   const bodyElem = document.querySelector("body");
//   loadingDiv.setAttribute("id", "loading");
//   bodyElem.append(loadingDiv, errorDiv);
//   //rootElem.innerHTML = "<p>Loading episodes…</p>";
//   // createShowSelect();

//   // loadShows();

//   // selectShow();
//}

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
    selectList();
  }

  const selectElement = document.querySelector("#dropDownList");
  selectElement.addEventListener("change", selectEpisode);
}

window.onload = setup;

function makePageForEpisodes(episodeList) {
  // Get the root container
  // select the < dive id = "root"> in HTML
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // clear any text or previous content inside the root.
  //createShowSelect();

  loadShows();

  selectShow();

  const search = document.createElement("div");
  search.setAttribute("id", "search");

  search.innerHTML = `<label for="searchBox">Search: <input id="searchBox" type="text"/><label/> <span id="searchString"><span>`;

  rootElem.appendChild(search);

  // loop over all episodes
  // currently it just logs each episode to the console so we can inspect the data
  episodeList.forEach((episode) => {
    // creates a <div> element that will hold One episode information
    const card = document.createElement("div");

    // add a CSS class to the card so we can style it later.
    card.className = "episode-card";

    // Format the episode code like 'S02E07'
    const episodeCode = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

    // Fill the card with episode information
    card.innerHTML = `<h3>${episode.name} - ${episodeCode}</h3>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <div class="summary"> ${episode.summary}</div>
    <a href = "${episode.url}" target="_blank">view on TvMaze</a>`;

    // add card to the root element.
    rootElem.appendChild(card);
  });
  //  Add attribution AFTER the loop
  const attribution = document.createElement("p");
  attribution.innerHTML = `Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a><span><a href="#" id="top">Back to Top<a><span/>`;
  attribution.className = "attribution";

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
  defaultOption.setAttribute("value", "Choose an episode");
  defaultOption.innerText = "--All Episodes--";

  selectLabel.appendChild(selectBox);

  selectBox.appendChild(defaultOption);

  displayArea.append(selectLabel);

  currentEpisodes.forEach((episode) => {
    let episodeName = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;

    let episodeOption = document.createElement("option");
    episodeOption.setAttribute("value", episodeName);
    episodeOption.innerHTML = episodeName;

    selectBox.appendChild(episodeOption);
  });
}

function selectEpisode(event) {
  let selectedEpisode = event.target.value.toLowerCase();
  let episodes = document.querySelectorAll(".episode-card");
  episodes.forEach((episode) => {
    let episodeName = (
      episode.querySelector("h3")?.textContent || ""
    ).toLowerCase();
    if (rearrangeName(episodeName).includes(selectedEpisode)) {
      episode.style.display = "block";
    } else if (selectedEpisode === "choose an episode") {
      episode.style.display = "block";
    } else {
      episode.style.display = "none";
    }
  });
}

function rearrangeName(episode) {
  let nameArray = episode.split("-");
  return `${nameArray[1]} - ${nameArray[0]}`;
}

function createShowSelect() {
  const rootElem = document.querySelector("#root");
  //rootElem.innerHTML = "";
  const search = document.createElement("div");
  search.setAttribute("id", "show-search");

  rootElem.appendChild(search);

  const displayArea = document.querySelector("#search");

  const showSelectLabel = document.createElement("label");
  showSelectLabel.setAttribute("for", "showDropDownList");
  showSelectLabel.innerText = "Select Show: ";

  const selectBox = document.createElement("select");
  selectBox.setAttribute("name", "show-list");
  selectBox.setAttribute("id", "showDropDownList");

  const defaultOption = document.createElement("option");
  defaultOption.setAttribute("value", "");
  defaultOption.innerText = "--All Shows--";

  showSelectLabel.appendChild(selectBox);

  selectBox.appendChild(defaultOption);

  search.appendChild(showSelectLabel);
}

function populateShowsList(shows) {
// Disabled for Level 500

  // const selectBox = document.querySelector("#showDropDownList");
  // if (!selectBox) {
  //   console.error("#showDropDownList not found");
  //   return;
  // }

  // // Clear existing options and add default
  // selectBox.innerHTML = '<option value="">--All Shows--</option>';

  // shows.forEach((show) => {
  //   let episodeOption = document.createElement("option");
  //   episodeOption.setAttribute("value", show.id);
  //   episodeOption.textContent = show.name;

  //   selectBox.appendChild(episodeOption);
  // });
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

        makePageForEpisodes(episodes);
        selectList();
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
/**
 * 1. Add a `select` element to your page so the user can choose a show.
    * add another select element    
2. When the user first loads the page, make a `fetch` request to https://api.tvmaze.com/shows ([documentation](https://www.tvmaze.com/api#show-index)) to get a list of available shows, and add an entry to the drop-down per show.
    * fetch index of episodes from tvmaze
    * loop through the list and add each entry to drop down 
    * when show is selected then fetch all episodes from that show
      * use show id to build correct URL for selected shows episodeList 
3. When a user selects a show, display the episodes for that show, just like the earlier levels of this project.
    * use existing functions to display the episodeList from previous step.

  You will need to perform a `fetch` to get the episode list.
4. Make sure that your search and episode selector controls still work correctly when you change shows.
5. Your select must list shows in alphabetical order, case-insensitive.
6. During one user's visit to your website, you should never fetch any URL more than once.
 */
