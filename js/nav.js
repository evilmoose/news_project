"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".user-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// function that is called when users click that navbar link.
function submitStoryClick(evt) {
  console.log("Submit click");
  console.debug("submitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
  //console.log("I click");
}

$submitStoryLink.on("click", submitStoryClick);

// Function for handling clicking on the 'favorites' link in the nav bar
function favoritedStoriesClick(evt) {
  console.log("favorite was click");
  console.debug("favoritedStoriesClick", evt);
  hidePageComponents();
  displayFavorites();
}

$body.on("click", "#favorites-link", favoritedStoriesClick)
