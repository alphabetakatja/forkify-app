// The Controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


import { elements, renderLoader, clearLoader } from './views/base';

// Global State of the app and contains:
// - Search Object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {};
window.state = state;

// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1. Get the query from view
    const query = searchView.getInput(); // TO DO

    if (query) {
        // 2. Create new search object and add it to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            // console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert(`Something went wrong with the search...`);
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    // console.log(btn);

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        // console.log(goToPage);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// RECIPE CONTROLLER
const controlRecipe = async() => {
    // 1. Get ID from the url
    const id = window.location.hash.replace('#', '');

    if(id) {
        // 2. Prepare UI for changes
        // we need to pass the parent to the loader
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highligh selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }    

        // 3. Create new recipe object
        state.recipe = new Recipe(id);

        // Testing - we are exposing the recipe to the global window object
        // window.r = state.recipe;

        try {
            // 4. Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 5. Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 6. Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(err) {
            console.log(err);
            alert('Error processing recipe...');
            clearLoader();
        }
        

    }
}

// Adding event listener to 2 events;
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER
const controlList = () => {
    // 1. Create a new list IF there is none yet
    if(!state.list) state.list = new List();

    // 2. Add each ingredient to the list and the UI
    state.recipe.ingredients.forEach(ingredient => {
        const item = state.list.addItem(ingredient.count, ingredient.unit, ingredient.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // console.log(id);

    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from the UI
        listView.deleteItem(id);

        // Handle the count update

    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val > 0) {
            state.list.updateCount(id, val);
        } 
    }
});

// LIKE CONTROLLER
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );

        // Toggle the like button

        // Add like to the UI list
        console.log(state.likes);

        // User HAS liked current recipe
    } else {
        // Remove like to the state
        state.likes.deleteLike(currentID);

        // Toggle the like button

        // Add like to the UI list
        console.log(state.likes);

    }

};


// Adding event listener to the servings buttons - handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

window.l = new List();




