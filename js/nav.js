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
}

$navLogin.on("click", navLoginClick);

/** Show story submit form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  getAndShowStoriesOnStart();
  $submitForm.show();
  $submitForm.css("display","flex");
}

$navSubmit.on("click", navSubmitClick);




/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show favorites list */
function navFavoriteClick() {
  console.debug("navFavoriteClick");
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on('click', navFavoriteClick);

/** Show my stories list */

function navMyStoriesClick() {
  console.debug("navMyStoriesClick");
  hidePageComponents();
  putMyStoriesOnPage();
}

$navMyStories.on('click', navMyStoriesClick);