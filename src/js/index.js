// The Controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global State of the app and contains:
// - Search Object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {};

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
        

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        // console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});





