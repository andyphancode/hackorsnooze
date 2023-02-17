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

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let starClass = "";

  if (currentUser) {
    starClass = currentUser.favorites.some(s => s.storyId === story.storyId) ? "fa fa-star" : "far fa-star";
  } else {
    starClass = ""
  }
  

  return $(`

      <li id="${story.storyId}">
       
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        
        <small class="story-author">by ${story.author}</small>
        <span class="star"><i class='${starClass}'></i></span>
        <small class="story-user">posted by ${story.username}</small>
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



/** On submit button click, takes values from inputs on submit form and adds a story to the API */

$submitButton.on('click', async function submitStory(evt){
  evt.preventDefault();
  console.debug("submitStory");
  $submitForm.hide();
  
  const submittedStory = {
    title: $submitTitle.val(),
    author: $submitAuthor.val(),
    url: $submitUrl.val(),
  };



  await storyList.addStory(currentUser, submittedStory);

  getAndShowStoriesOnStart();
  $submitAuthor.val('');
  $submitTitle.val('');
  $submitUrl.val('');
});



/** Gets list of favorites from user and generates their HTML to put on page */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allFavoritesList.empty();

  for (let story of currentUser.favorites) {
    const $favorite = generateStoryMarkup(story);
    $allFavoritesList.append($favorite);  
  }
  
  $allFavoritesList.show();
}


/**  add or remove favorites when a user clicks on a star next to a story
 *  removes/adds to currentUser as well as updates API
 */
async function addOrRemoveFavorite() {
  
  const response = await axios({
    url: `${BASE_URL}/stories/${$(this).parent()[0].id}`,
    method: "GET"
  });
  if($(this)[0].children[0].classList.value === "far fa-star") {
    $(this)[0].children[0].classList.value = "fa fa-star"
    currentUser.addFavorite(response.data.story);
  } else {
    $(this)[0].children[0].classList.value = "far fa-star"
    currentUser.removeFavorite(response.data.story);
  }

}

$allStoriesList.on('click', '.star', addOrRemoveFavorite);
$allFavoritesList.on('click', '.star', addOrRemoveFavorite);

/** Gets list of stories from user and generates their HTML to put on page */

function generateMyStoriesMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`

      <li id="${story.storyId}">
       
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        
        <small class="story-author">by ${story.author}</small>
        <span class="delete"><b>X</b></span>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Display stories on page after generating markup */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $myStoriesList.empty()

  for (let story of currentUser.ownStories) {
    const $myStory = generateMyStoriesMarkup(story);
    $myStoriesList.append($myStory);  
  }
  
  $myStoriesList.show();
}

/** Delete story from my stories on currentUser and API, then reload page */

async function deleteStory() {
  console.debug("deleteStory");
  const removeResponse = await axios({
    url: `${BASE_URL}/stories/${$(this).parent()[0].id}`,
    method: "DELETE",
    params: {token: currentUser.loginToken}
  })
  currentUser.ownStories = currentUser.ownStories.filter(s => s.storyId !== $(this).parent()[0].id);
  await getAndShowStoriesOnStart();
  navMyStoriesClick();
}

$($myStoriesList).on('click', '.delete', deleteStory);