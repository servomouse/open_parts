import { updateComponents, getComponentsStats } from './components.js';
import { displayComponents } from './display_components.js';
import { initSearch } from './search.js';
import { initResize } from './resize.js';
import { sortComponents } from './sorting.js';

const barChartColors = [
    "#007bff", "#28a745", "#ffc107", "#17a2b8", "#dc3545", "#6c757d"
];

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

function updateComponentsStats(componentsStats) {
    const barChart = document.getElementById('dataset-stats-bar-chart');
    const barChartLegendList = document.getElementById('dataset-stats-bar-chart-legend-list');
    let colorIdx = 0;
    let numComponents = 0;
    for (const category in componentsStats) {
        numComponents += componentsStats[category];
    }
    for (const category in componentsStats) {
        // Bar chart sections:
        const barChartSection = document.createElement('div');
        barChartSection.className = 'copy-symbol';
        barChartSection.style.width = `${100 * (componentsStats[category] / numComponents)}%`;
        barChartSection.style.height = '100%';
        barChartSection.style.backgroundColor = `${barChartColors[colorIdx]}`;
        barChart.appendChild(barChartSection);

        // Bar chart legend:
        const barChartLegendItem = document.createElement('div');
        barChartLegendItem.className = 'dataset-stats-bar-chart-legend-list-item';

        const barChartLegendItemSquare = document.createElement('div');
        barChartLegendItemSquare.className = 'dataset-stats-bar-chart-legend-list-item-square';
        barChartLegendItemSquare.style.backgroundColor = `${barChartColors[colorIdx]}`;
        barChartLegendItem.appendChild(barChartLegendItemSquare);

        const barChartLegendItemSpan = document.createElement('span');
        barChartLegendItemSpan.innerText = `${category} (${componentsStats[category]})`;
        barChartLegendItem.appendChild(barChartLegendItemSpan);

        barChartLegendList.appendChild(barChartLegendItem);

        colorIdx += 1;
    }
}

updateComponentsStats(getComponentsStats());

function editField(fieldId) {   // Called from HTML
    const inputField = document.getElementById(fieldId);
    if (inputField.readOnly) {
        inputField.readOnly = false; // Make the field editable
        inputField.focus(); // Focus on the input field
    } else {
        inputField.readOnly = true; // Make the field read-only again
    }
}

function toggleEdit() {
    const button = document.getElementById('component-info-edit-button');
    if (button.innerText === 'Edit') {
        button.innerText = 'Save';
        toggleFields(true);
    } else {
        button.innerText = 'Edit';
        toggleFields(false);
    }
}

function toggleFields(editable) {
    const fields = document.querySelectorAll('.component-info-input');
    fields.forEach(field => {
        field.readOnly = !editable; // Toggle readOnly attribute
    });

    if (editable) {
        const spans = document.querySelectorAll('.component-info-input-span');
        spans.forEach(span => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.innerText; // Set the input value to the current text
            input.className = 'component-info-input'; // Optional: add a class for styling
            
            // Remove the copy symbol
            const copySymbol = span.nextElementSibling; // Get the copy symbol
            if (copySymbol && copySymbol.classList.contains('copy-symbol')) {
                copySymbol.remove(); // Remove the copy symbol
            }
            
            // Replace the span with the input
            span.parentNode.replaceChild(input, span);
        });
    } else {
        const inputs = document.querySelectorAll('.component-info-input');
        inputs.forEach(input => {
        if (input) {
            const newSpan = document.createElement('span');
            newSpan.className = 'component-info-input-span'; // Optional: add the original class for styling
            newSpan.innerText = input.value; // Save the value back to the new span
            
            // Replace the input with the new span
            input.parentNode.replaceChild(newSpan, input);

            if (newSpan.parentNode.classList.contains('has-copy-symbol')) {
                // Add the copy symbol back
                const copySymbol = document.createElement('span');
                copySymbol.className = 'copy-symbol';
                copySymbol.onclick = function() { copyToClipboard(this); }; // Set the onclick event
                copySymbol.title = "Copy to clipboard";
                copySymbol.innerHTML = '&#10064;'; // Copy symbol character
                
                // Insert the copy symbol after the new span
                newSpan.parentNode.insertBefore(copySymbol, newSpan.nextSibling);
            }
        }
        });
    }
}

function copyToClipboard(button) {
    // Find the span element next to the button
    const span = button.previousElementSibling;
    
    // Create a temporary input element to hold the text
    const tempInput = document.createElement('input');
    tempInput.value = span.innerText; // Set the input value to the span's text
    document.body.appendChild(tempInput); // Append the input to the body
    tempInput.select(); // Select the text
    document.execCommand('copy'); // Copy the text to the clipboard
    document.body.removeChild(tempInput); // Remove the temporary input

    // Optionally, provide feedback to the user
    alert('Copied: ' + span.innerText);
}

// Make functions visible from HTML
window.toggleEdit = toggleEdit;
window.editField = editField;
window.copyToClipboard = copyToClipboard;
