// The Controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global State of the app and contains:
// - Search Object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1. Get the query from view
    const query = searchView.getInput(); // TO DO
    console.log(query);

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
    console.log(id);

    if(id) {
        // 2. Prepare UI for changes

        // 3. Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // 4. Get recipe data
            await state.recipe.getRecipe();

            // 5. Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 6. Render the recipe
            console.log(state.recipe);
        } catch(err) {
            console.log(err);
            alert(`Error processing recipe...`);
        }
        

    }
}

// Adding event listener to 2 events;
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));





