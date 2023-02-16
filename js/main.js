//Creating global variables
let tvArray = [];
let fullWatchList = [];

//Create watch list in DOM if LocalStorage has anything in its watchList item
if (localStorage.getItem("watchList") != null) {
  //Convert from localStorage to an array fullWatchList
  fullWatchList = localStorage.getItem("watchList").split(",");
  makeWatchList(fullWatchList);
}

//Get Show button will getFetch on click
document.querySelector("button").addEventListener("click", getFetch);

//Take in data from tvmaze api
function getFetch() {
  const choice = document.querySelector("input").value;
  const url = `https://api.tvmaze.com/search/shows?q=${choice}`;

  fetch(url)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      //Set returned JSON object to tvArray
      tvArray = data;
      console.log(tvArray);
      makeShowList(tvArray);
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

//Shows that match query will be rendered to the DOM in a list
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

//Add shows to watch list
function addShowsToWatchlist() {
  //Take in all checked boxes within the searchedShows section of DOM
  watchList = document.querySelectorAll(
    '.searchedShows input[type="checkbox"]:checked'
  );
  //Turn NodeList into an Array then map each value to its name
  watchList = Array.from(watchList).map((show) => show.value);
  addToFullWatchList(watchList);
  //Pass in global fullWatchList variable for watch list to be rendered to the DOM
  makeWatchList(fullWatchList);
}

function makeWatchList(list) {
  //If there's no list available do nothing
  if (!list) {
    return;
  }
  //Remove ul of shows on watchlist if it exists (done so by checking if a class exists in DOM)
  if (document.querySelector(".watchList")) {
    document.querySelector(".watchList").remove();
  }
  //Create ul for watchlist shows
  let ul = document.createElement("ul");
  //Add class to be checked above
  ul.classList.add("watchList");
  //Get the section to be appended to
  let watchListSection = document.querySelector(".watchListSection");

  //Go through the passed in list and create each item with show name and checkbox
  list.forEach((show) => {
    let li = document.createElement("li");
    li.textContent = show;
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", show);
    //If clicked, remove the show from the watchlist via removeFromFullWatchList
    //remove list item via parentNode.remove() taken from the event (e)
    input.addEventListener("click", (e) => {
      removeFromFullWatchList(e);
      e.srcElement.parentNode.remove();
    });
    //Append checkbox to list item, list item to ul
    li.appendChild(input);
    ul.appendChild(li);
  });
  //Append created ul to watchlist section
  watchListSection.appendChild(ul);
}

//Takes in list of shows and will add them to fullWatchList if they are not already there
function addToFullWatchList(list) {
  list.forEach((show) => {
    if (fullWatchList.indexOf(show) < 0) {
      fullWatchList.push(show);
    }
  });
  //convert fullWatchList to string to store in LocalStorage
  localStorage.setItem("watchList", fullWatchList.toString());
}

//Takes in the checkbox and removes from fullWatchList variable via its value
function removeFromFullWatchList(box) {
  fullWatchList.splice(fullWatchList.indexOf(box.srcElement.value), 1);
  //Converts array to string for localStorage
  localStorage.setItem("watchList", fullWatchList.toString());
  //If there's nothing left in localStorage, delete entire item from localStorage to prevent issues
  if (localStorage.getItem("watchList") === "") {
    localStorage.removeItem("watchList");
  }
}
