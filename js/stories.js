"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteButton = false) {
  // console.debug("generateStoryMarkup", story);
  console.log("generateStoryMarkup was called")
  const hostName = story.getHostName();
  console.log(hostName);

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      <div>
        ${ deleteButton ? addDeleteButton() : ""}
        ${showStar ? getStarButton(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Function to add story when submit-form is clicked.
async function addNewStory(event) {
  console.debug("addNewStory");
  event.preventDefault();

  // get info from form
  const title = $("#add-title").val();
  const url = $("#add-url").val();
  const author = $("#add-author").val();
  const username = currentUser.username
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $generateStory = generateStoryMarkup(story);
  $allStoriesList.prepend($generateStory);

  // hide the form and reset it
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", addNewStory);

// Function to display facorites
function displayFavorites() {
  console.debug("displayFavorites");
  console.log("I displayFavorites called")
  $favoritedStories.empty();



  if (currentUser.favorites.length === 0) { 
    console.log("was true")
    $favoritedStories.append("<h5>You have not added any favorites!</h5>");
  }
  else {
    console.log("was false")
    for (let story of currentUser.favorites) {
      console.log(story)
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

// Function to handle clicking on favorite and unclicking
async function clickFavorite(event) {
  console.debug("clickfavorite");

  const $tar = $(event.target);
  const $closetLi = $tar.closest("li");
  const storyId = $closetLi.attr("id");
  const story = storyList.stories.find(stry => stry.storyId === storyId);

  if ($tar.hasClass("fas")) {
    await currentUser.removeFavorited(story);
    $tar.closest("i").toggleClass("fas far");
  }
  else {
    await currentUser.addFavorite(story);
    $tar.closest("i").toggleClass("fas far");
  }
}

// Add a star button for favorites

function getStarButton(story, user) {
  const isFavorite = user.isFavorite(story);
  const star = isFavorite ? "fas" : "far";

  return `
    <span class="star">
      <i class="${star} fa-star"></i>
    </span>`;
}

$storiesLists.on("click", ".star", clickFavorite);

// Function to display user created stories
function displayUserStories() {
  console.debug("displayUserStories")

  $userStories.empty();
  
  console.log(currentUser.ownStories.length)
  if (currentUser.ownStories.length === 0) {
    $userStories.append("<h5>No user storries available!</h5>");
  }
  else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $userStories.append($story);
    }
  }

  $userStories.show();
}

// Create a delete button to click when you want to delete a user created story.
function addDeleteButton() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </sapan>`;
}

// Function to handle deleting a story
async function deleteStory(event) {
  console.debug("deleteStory");

  const $closetLi = $(event.target).closest("li");
  const storyId = $closetLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await displayUserStories();
}

$userStories.on("click", ".trash-can", deleteStory);
