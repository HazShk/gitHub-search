var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoSearchTerm = document.querySelector("#repo-search-term");
var repoContainerEl = document.querySelector("#repos-container");

var formSubmitHandler = function (event) {
  event.preventDefault();
  //get what the user typed
  var userName = nameInputEl.value.trim();
  if (userName) {
    getUserRepos(userName); //pass it to getUserRepos function
    nameInputEl.value = ""; //clear the user input after
  }
};

var getUserRepos = function (user) {
  //dynamic url for user parameter
  var apiUrl = "https://api.github.com/users/" + user + "/repos";
  //fetch api
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user); //pass data and username to displayrepo function)
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found";
    return;
  }
  // clear old content first
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over every repo in the array
  for (var i = 0; i < repos.length; i++) {
    // build the repo name like "octocat/hello-world"
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a div to hold this repo's info
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    // create a span for the repo name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // add name to the div
    repoEl.appendChild(titleEl);

    // create a span for the issues count
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if repo has issues
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // add issues to the div
    repoEl.appendChild(statusEl);

    // add the whole div to the page
    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
