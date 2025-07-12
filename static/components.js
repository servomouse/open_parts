import { openModal } from './modal.js';

export let components = null;

const fields = {
    resistors: ["name", "case", "value", "precision", "description"],
    capacitors: ["name", "case", "value", "voltage", "description"],
    ics: ["name", "case", "description"],
};

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

export async function displayComponents() {
    components = await fetchComponents();
    const componentList = document.getElementById('components');
    componentList.innerHTML = '';

    for (const type in components) {
        // Create a sub-table for each component type
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        // Create table headers
        fields[type].forEach(field => {
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
        components[type].forEach((component, index) => {
            const row = document.createElement('tr');
            // Alternate row colors
            row.style.backgroundColor = index % 2 === 0 ? 'lightblue' : 'lightgreen';

            fields[type].forEach(field => {
                const td = document.createElement('td');
                td.textContent = component[field] || ''; // Handle missing fields
                row.appendChild(td);
            });

            // Add the amount cell
            const tdAmount = document.createElement('td');
            tdAmount.textContent = component.amount || ''; // Display amount
            row.appendChild(tdAmount);

            row.onclick = () => displayComponentDetails(component); // Add click event to row
            table.appendChild(row);
        });

        // Add the table to the component list
        const section = document.createElement('section');
        const headerDiv = document.createElement('div'); // Create a div for the header
        headerDiv.style.display = 'flex'; // Use flexbox for alignment
        headerDiv.style.justifyContent = 'space-between'; // Space between title and button
        headerDiv.style.width = 'calc(100% - 20px)';

        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize type

        // Create the "Add" button
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            openModal(type);
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

// Function to display selected component details
function displayComponentDetails(component) {
    document.getElementById('component-image').src = component.image;
    document.getElementById('component-name').textContent = component.name;
    document.getElementById('component-description').textContent = component.description;

    const kicadLinks = document.getElementById('kicad-links');
    kicadLinks.innerHTML = '';
    component.kicadLinks.forEach(link => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
        kicadLinks.appendChild(li);
    });

    // Placeholder for 3D model viewer
    const viewer = document.getElementById('3d-viewer');
    viewer.innerHTML = `<p>3D model for ${component.name} will be displayed here.</p>`;
    // Here you can integrate your 3D viewer logic to load the STEP file
}