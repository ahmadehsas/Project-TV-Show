//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  const episodeSearch = document.querySelector("#searchBox");
  episodeSearch.addEventListener("input", (e) => {
    let searchString = e.target.value.toLowerCase();
    let episodes = document.querySelectorAll(".episode-card");
    let matchCount = 0;

    episodes.forEach((episode) => {
      let episodeName = (
        episode.querySelector("h3")?.textContent || ""
      ).toLowerCase();
      let episodeSummary = (
        episode.querySelector(".summary")?.textContent || ""
      ).toLowerCase();

      if (
        episodeName.includes(searchString) ||
        episodeSummary.includes(searchString)
      ) {
        episode.style.display = "block";
        matchCount++;
      } else {
        episode.style.display = "none";
      }
    });

    // Update the search counter
    const searchCounter = document.querySelector("#searchString");
    if (searchString === "") {
      searchCounter.innerText = "";
    } else {
      searchCounter.innerText = `Displaying ${matchCount}/${allEpisodes.length} episodes`;
    }
    matchCount = 0;
  });

  selectList(allEpisodes);

  const selectElement = document.querySelector("#dropDownList");

  selectElement.addEventListener("change", selectEpisode);
}

function makePageForEpisodes(episodeList) {
  // Get the root container
  // select the < dive id = "root"> in HTML
  const rootElem = document.getElementById("root");

  // clear any text or previous content inside the root.
  rootElem.innerHTML = "";

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

window.onload = setup;

function selectList(episodeArray) {
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
  defaultOption.innerText = "--Choose an episode--";

  selectLabel.appendChild(selectBox);

  selectBox.appendChild(defaultOption);

  displayArea.append(selectLabel);

  episodeArray.forEach((episode) => {
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
