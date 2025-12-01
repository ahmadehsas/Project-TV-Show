//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  // Get the root container
  // select the < dive id = "root"> in HTML
  const rootElem = document.getElementById("root");

  // clear any text or previous content inside the root.
  rootElem.innerHTML = "";

  // loop over all episodes
  // currently it just logs each episode to the console so we can inspect the data
  episodeList.forEach((episode) => {
    console.log(episode); 
  })
   
}

window.onload = setup;
