//Example fetch using pokemonapi.co
document.querySelector("button").addEventListener("click", getFetch);
let tvArray = [];
let fullWatchList = [];
if (localStorage.getItem("watchList") != null) {
  fullWatchList = localStorage.getItem("watchList").split(",");
}
makeWatchList(fullWatchList);
function getFetch() {
  const choice = document.querySelector("input").value;
  const url = `https://api.tvmaze.com/search/shows?q=${choice}`;

  fetch(url)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      tvArray = data;
      console.log(tvArray);
      makeShowList(tvArray);
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function makeShowList(tvShows) {
  //Remove list of searched shows if it already exists in the DOM prior to making a new one
  if (document.querySelector(".searchedShows")) {
    document.querySelector(".searchedShows").remove();
  }
  //Select the section of DOM where list of searched shows will be added
  let selectSection = document.querySelector(".selectShow");
  //Create ul
  let ul = document.createElement("ul");
  ul.classList.add("searchedShows");
  //Make tv show list items and add to list with checkboxes
  tvShows.forEach((tvShow) => {
    let li = document.createElement("li");
    li.textContent = tvShow.show.name;
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", tvShow.show.name);
    li.appendChild(input);
    selectSection.appendChild(ul);
    ul.appendChild(li);
  });
  //Create button for submitting shows to watchlist
  let btn = document.createElement("button");
  btn.textContent = "Add to watchlist";
  btn.addEventListener("click", addShowsToWatchlist);
  ul.appendChild(btn);
}

function addShowsToWatchlist() {
  watchList = document.querySelectorAll(
    '.searchedShows input[type="checkbox"]:checked'
  );
  watchList = Array.from(watchList).map((show) => show.value);
  addToFullWatchList(watchList);
  makeWatchList(fullWatchList);
}

function makeWatchList(list) {
  if (!list) {
    return;
  }
  if (document.querySelector(".watchList")) {
    document.querySelector(".watchList").remove();
  }
  let ul = document.createElement("ul");
  ul.classList.add("watchList");
  let watchListSection = document.querySelector(".watchListSection");

  list.forEach((show) => {
    let li = document.createElement("li");
    li.textContent = show;
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", show);
    input.addEventListener("click", (e) => {
      removeFromFullWatchList(e);
      e.srcElement.parentNode.remove();
    });
    li.appendChild(input);
    ul.appendChild(li);
  });
  watchListSection.appendChild(ul);
}

function addToFullWatchList(list) {
  list.forEach((show) => {
    if (fullWatchList.indexOf(show) < 0) {
      fullWatchList.push(show);
    }
  });
  localStorage.setItem("watchList", fullWatchList.toString());
}

function removeFromFullWatchList(box) {
  fullWatchList.splice(fullWatchList.indexOf(box.srcElement.value), 1);
  localStorage.setItem("watchList", fullWatchList.toString());
}
