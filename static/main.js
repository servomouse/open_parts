import { updateComponents } from './components.js';
import { displayComponents } from './display_components.js';
import { initSearch } from './search.js';
import { initResize } from './resize.js';
import { sortComponents } from './sorting.js';

// Function to fetch components from the backend
async function fetchComponents() {
    try {
        const response = await fetch('/api/components');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
        // displayComponents(components);
    } catch (error) {
        console.error('Error fetching components:', error);
        return {};
    }
}

initResize();
initSearch();
updateComponents(sortComponents(await fetchComponents()));
displayComponents(null);
