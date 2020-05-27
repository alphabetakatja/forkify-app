// The Controller
import Search from './models/Search';

// Global State of the app and contains:
// - Search Object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {};

const controlSearch = async () => {
    // 1. Get the query from view
    const query = 'pizza'; // TO DO

    if (query) {
        // 2. Create new search object and add it to state
        state.search = new Search(query);

        // 3. Prepare UI for results

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});





