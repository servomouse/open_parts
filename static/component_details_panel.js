
// Function to display selected component details
export function displayComponentDetails(category, infex, component) {
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