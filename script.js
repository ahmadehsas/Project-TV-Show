//You can edit ALL of the code here
let mySearchString = "";
let episodeCount = 0;

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
    searchCounter.innerText = `Displaying ${matchCount}/${allEpisodes.length} episodes`;
  });
  /*
  mySearchString = "";
  episodeCount = 0;

  document
    .querySelector("#searchBox")
    .addEventListener("input", function (event) {
      searchForEpisode(allEpisodes, event);
    });*/
  /**
   * we need to add an event listener to our input area.
   * for each keystroke we add the value to our string
   * we also pass this string to the filter function
   * we update our count of matching episodes
   * we display the count of matching episodes
   * pass the count value to the span element to display.
   */
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
  attribution.innerHTML = `Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>`;
  attribution.className = "attribution";

  rootElem.appendChild(attribution);
}

function searchForEpisode(allEpisodes, event) {
  /**
   * When a user types a search term into the search box:
      1. Only episodes whose summary **OR** name contains the search term should be displayed
        - take the search term entered by user
        - look through summary and name for match
          - if match add episode to new list of episodes
          - if no match do nothing
      2. The search should be case-**in**sensitive
        - use regex to make the search term case insensitive
      3. The display should update **immediately** after each keystroke changes the input
        - return value after each keystroke
        - search for match after each keystroke
      4. Display how many episodes match the current search
        - count the number of matching episodes and display the total
      5. If the search box is cleared, **all** episodes should be shown
        - if search box is clear then display all episodes
  */
  /*
  function matchEpisode(episode) {
    if (
      episode.name.toLowerCase().includes(mySearchString) ||
      episode.summary.toLowerCase().includes(mySearchString)
    ) {
      return true;
    }

    return false;
  }
  let matchingEpisodes = [];
  mySearchString = event.target.value.toLowerCase();

  matchingEpisodes = allEpisodes.filter(matchEpisode);
  episodeCount = matchingEpisodes.length;

  if (episodeCount > 0) {
    const matchingEpisodeCount = document.querySelector("#searchString");
    matchingEpisodeCount.innerText = `Displaying ${episodeCount}/${allEpisodes.length} episodes`;
  }
  episodeCount = 0;
  matchingEpisodes = [];*/
}

window.onload = setup;
