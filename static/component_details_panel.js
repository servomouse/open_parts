
// Function to display selected component details
export function displayComponentDetails(category, index, component) {
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

export async function fillComponentDetails(category, index, component) {
    // Get the image from the backend
    const imageResponse = await fetch(`/api/component_image?category=${encodeURIComponent(component.category)}&case=${encodeURIComponent(component.case)}`);
    const imageUrl = await imageResponse.text(); // Assuming the backend returns the image URL as plain text

    // Get the details section
    const detailsSection = document.getElementById('details');

    // Clear previous details
    detailsSection.innerHTML = '';

    // Create elements for the component details
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.alt = component.name;
    imageElement.style.width = '200px'; // Set a fixed width for the image
    imageElement.style.height = 'auto'; // Maintain aspect ratio

    const nameElement = document.createElement('h3');
    nameElement.textContent = component.name;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = component.description;

    const valueElement = document.createElement('p');
    valueElement.textContent = `Value: ${component.value}`;

    const precisionElement = document.createElement('p');
    precisionElement.textContent = `Precision: ${component.precision}`;

    const technologyElement = document.createElement('p');
    technologyElement.textContent = `Technology: ${component.technology}`;

    const amountLabel = document.createElement('label');
    amountLabel.textContent = 'Amount: ';
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = component.amount;
    amountInput.min = 0; // Prevent negative amounts

    // Append all elements to the details section
    detailsSection.appendChild(imageElement);
    detailsSection.appendChild(nameElement);
    detailsSection.appendChild(descriptionElement);
    detailsSection.appendChild(valueElement);
    detailsSection.appendChild(precisionElement);
    detailsSection.appendChild(technologyElement);
    detailsSection.appendChild(amountLabel);
    detailsSection.appendChild(amountInput);
}

// // Example usage
// const exampleComponent = {
//     category: "Resistor",
//     name: "10k Ohm Resistor",
//     case: "0603",
//     value: "10k",
//     precision: "1%",
//     technology: "film",
//     description: "Standard 10k Ohm resistor.",
//     amount: 10
// };

// // Call the function with the example component
// fillComponentDetails(exampleComponent);