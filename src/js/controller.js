import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarksDel from './views/bookmarksDel.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

//function for reuse - goal: display or hide btn 'Delete all' 
const checkAndChangeDelBtn = function () {
  if (model.state.bookmarks.length >= 2) bookmarksView.displayDelAllBtn();
  else bookmarksView.hideDelAllBtn();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);

  //4) display or hide btn 'Delete all'
  checkAndChangeDelBtn();
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);

  //display or hide btn 'Delete all'
  checkAndChangeDelBtn();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //display or hide btn 'Delete all'
    checkAndChangeDelBtn();
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const controlDelBookmarks = async function () {
  try {
    if (model.state.bookmarks.length >= 1)
      //Popup
      _confirmed = await bookmarksDel.callConfirmation();

    //if clicked YES
    if (_confirmed) {

      //Delete bookmarks preview
      model.state.bookmarks = [];
      bookmarksView.render(model.state.bookmarks)


      //Delete filled in recipe
      model.state.recipe.bookmarked = false;
      recipeView.update(model.state.recipe);

      //Clear loacal Storage
      model.clearBookmarks();

      //display or hide btn 'Delete all'
      checkAndChangeDelBtn();
    }
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarksDel.addHandlerBookmarksDel(controlDelBookmarks);
};
init();
