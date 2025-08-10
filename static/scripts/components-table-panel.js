// import { openModal } from './modal.js';
// import { displayComponentDetails, fillComponentDetails } from './component_details_panel.js';
import { showComponentInfo } from './component-info-panel.js';
import { getComponents } from './components.js';

const fields = {
    Resistors: ["value", "package", "precision", "description"],
    Capacitors: ["value", "package", "voltage", "technology", "description"],
    ICs: ["name", "package", "description"],
};

export function displayComponents(componentsDict) {
    // components = sortComponents(await fetchComponents());
    if(null === componentsDict) {
        componentsDict = getComponents();
    }
    const componentList = document.getElementById('components');
    componentList.innerHTML = '';

    for (const category in componentsDict) {
        // Create a sub-table for each component category
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        // Create table headers
        fields[category].forEach(field => {
            const th = document.createElement('th');
            th.textContent = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize first letter
            headerRow.appendChild(th);
        });

        // Add "Amount" column header
        const thAmount = document.createElement('th');
        thAmount.textContent = "Amount";
        headerRow.appendChild(thAmount);

        table.appendChild(headerRow);

        // Populate the table with component data
        componentsDict[category].forEach((component, index) => {
            const row = document.createElement('tr');

            fields[category].forEach(field => {
                const td = document.createElement('td');
                td.textContent = component[field] || ''; // Handle missing fields
                row.appendChild(td);
            });

            // Add the amount cell
            const tdAmount = document.createElement('td');
            tdAmount.textContent = component.amount || ''; // Display amount
            row.appendChild(tdAmount);

            row.onclick = () => showComponentInfo(component); // Add click event to row
            table.appendChild(row);
        });

        // Add the table to the component list
        const section = document.createElement('section');
        const headerDiv = document.createElement('div'); // Create a div for the header
        headerDiv.style.display = 'flex'; // Use flexbox for alignment
        headerDiv.style.justifyContent = 'space-between'; // Space between title and button
        headerDiv.style.width = 'calc(100% - 20px)';
        // headerDiv.style.marginBottom = '20px';

        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize category

        // Create the "Add" button
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.className = 'component-list-add-button';
        addButton.onclick = () => {
            // openModal(category);
        };

        // Append the title and button to the header div
        headerDiv.appendChild(sectionHeader);
        headerDiv.appendChild(addButton);

        // Append the header div to the section
        section.appendChild(headerDiv);
        section.appendChild(table);
        componentList.appendChild(section);
    }
}