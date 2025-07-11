const components = {
    resistors: [
        {
            id: "0603_10k_1%",
            name: "10k Ohm Resistor",
            case: "0603",
            value: "10k",
            precision: "1%",
            description: "Standard 10k Ohm resistor.",
            image: "path/to/resistor-image.jpg",
            kicadLinks: ["link/to/footprint", "link/to/symbol"],
            model: "path/to/3d-model.step",
            amount: 10
        },
        {
            id: "0603_100k_1%",
            name: "100k Ohm Resistor",
            case: "0603",
            value: "100k",
            precision: "1%",
            description: "Standard 10k Ohm resistor.",
            image: "path/to/resistor-image.jpg",
            kicadLinks: ["link/to/footprint", "link/to/symbol"],
            model: "path/to/3d-model.step",
            amount: 10
        }
    ],
    capacitors: [
        {
            id: "0805_10uF_50v",
            name: "10uF Capacitor",
            case: "0805",
            value: "10uF",
            voltage: "500000000000000000v",
            description: "Electrolytic capacitor, 100uF.",
            image: "path/to/capacitor-image.jpg",
            kicadLinks: ["link/to/footprint", "link/to/symbol"],
            model: "path/to/3d-model.step",
            amount: 10
        }
    ],
    ics: [
        {
            id: "ne555_dip8",
            name: "NE555 Timer",
            case: "DIP-8",
            description: "Simple timer",
            image: "path/to/capacitor-image.jpg",
            kicadLinks: ["link/to/footprint", "link/to/symbol"],
            model: "path/to/3d-model.step",
            amount: 10
        }
    ]
};

const fields = {
    resistors: ["name", "case", "value", "precision", "description"],
    capacitors: ["name", "case", "value", "voltage", "description"],
    ics: ["name", "case", "description"],
};

function displayComponents() {
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
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize type
        section.appendChild(sectionHeader);
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

// Search functionality
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

// Initial display of components
displayComponents();

// Resizing functionality
const resizer = document.getElementById('resizer');
const componentList = document.getElementById('component-list');
const componentDetails = document.getElementById('component-details');

resizer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
});

function resize(e) {
    const newWidth = e.clientX - componentList.getBoundingClientRect().left;
    if (newWidth > 200 && newWidth < window.innerWidth - 300) { // Set min and max width
        componentList.style.width = newWidth + 'px';
        componentDetails.style.width = `calc(100% - ${newWidth + 20}px)`; // Adjust for margin
    }
}

function stopResize() {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
}
