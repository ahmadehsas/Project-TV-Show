// cache episodes per show id to avoid re-fetching during the same visit
const episodesCache = new Map();

function selectShow() {
const showSelect = document.querySelector("#showDropDownList");
if (!showSelect) return;

showSelect.addEventListener("change", async (event) => {
const selectedOption = event.target.value;
console.log(selectedOption + " thats the user's pick");

    // handle default/empty selection: show all episodes for default behavior
    if (!selectedOption) {
      // if user chooses the default (All Shows), fall back to the initial show (82) or keep existing allEpisodes
      // here we'll simply re-render the current allEpisodes (no fetch)
      makePageForEpisodes(allEpisodes);
      // rebuild episode dropdown and wire up search again
      selectList();
      setupSearch();
      return;
    }

    const showId = Number(selectedOption);

    // If cached, reuse
    if (episodesCache.has(showId)) {
      console.log(`Using cached episodes for show ${showId}`);
      allEpisodes = episodesCache.get(showId);
      makePageForEpisodes(allEpisodes);
      selectList();
      setupSearch();
      return;
    }

    // otherwise fetch episodes for the selected show
    try {
      const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to load episodes for show ${showId}`);
      const episodes = await resp.json();
      // cache and render
      episodesCache.set(showId, episodes);
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
      // rebuild select & search for the new episode list
      selectList();
      setupSearch();
    } catch (err) {
      console.error(err);
      const rootElem = document.getElementById("root");
      if (rootElem) rootElem.innerHTML = `<p>Sorry, failed to load episodes for show ${showId}.</p>`;
    }

});
}
