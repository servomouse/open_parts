import { components } from './components.js';

export function initSearch() {
    document.getElementById('search-bar').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredComponents = {};
        
        for (const type in components) {
            filteredComponents[type] = components[type].filter(component => 
                component.name.toLowerCase().includes(query)
            );
        }
        
        displayFilteredComponents(filteredComponents);
    });
}

// Function to display filtered components
function displayFilteredComponents(filteredComponents) {
    const componentList = document.getElementById('components');
    componentList.innerHTML = '';

    for (const type in filteredComponents) {
        if (filteredComponents[type].length > 0) {
            const table = document.createElement('table');
            const headerRow = document.createElement('tr');

            // Create table headers
            fields[type].forEach(field => {
                const th = document.createElement('th');
                th.textContent = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize first letter
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // Populate the table with filtered component data
            filteredComponents[type].forEach(component => {
                const row = document.createElement('tr');
                fields[type].forEach(field => {
                    const td = document.createElement('td');
                    td.textContent = component[field] || ''; // Handle missing fields
                    row.appendChild(td);
                });
                row.onclick = () => displayComponentDetails(component); // Add click event to row
                table.appendChild(row);
            });

            // Add the table to the component list
            const section = document.createElement('section');
            const sectionHeader = document.createElement('h3');
            sectionHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize type
            section.appendChild(sectionHeader);
            section.appendChild(table);
            componentList.appendChild(section);
        }
    }
}