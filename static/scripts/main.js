import { updateComponents, getComponentsStats } from './components.js';
import { displayComponents } from './components-table-panel.js';
import { sortComponents } from './sorting.js';
import { fetchComponents, upate_component } from './network.js';

function initResize() {
    const resizer = document.getElementById('resizer');

    resizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    });
}

function resize(e) {
    const componentList = document.getElementById('left-section');
    let componentDetails = document.getElementById('right-section');
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

initResize();
// initSearch();

updateComponents(sortComponents(await fetchComponents()));
displayComponents(null);

const barChartColors = [
    "#007bff", "#28a745", "#ffc107", "#17a2b8", "#dc3545", "#6c757d"
];

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
