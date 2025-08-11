

const barChartColors = [
    "#007bff", "#28a745", "#ffc107", "#17a2b8", "#dc3545", "#6c757d"
];

const dashboardHtml = `
<section style="margin-bottom: 30px;">
    <h2 style="color: #007bff;">Dashboard Overview</h2>
    <div style="display: flex; justify-content: space-around;">
        <div style="text-align: center;">
            <h3>Total Components</h3>
            <p id="dataset-stats-total-components" style="font-size: 24px; color: #007bff;">170</p>
        </div>
        <div style="text-align: center;">
            <h3>New Arrivals</h3>
            <p id="dataset-stats-new-arrivals" style="font-size: 24px; color: #007bff;">10</p>
        </div>
        <div style="text-align: center;">
            <h3>Categories</h3>
            <p id="dataset-stats-num-categories" style="font-size: 24px; color: #007bff;">5</p>
        </div>
    </div>
</section>

<section style="margin-bottom: 30px;">
    <h2 style="color: #007bff;">Component Distribution</h2>
    <div class="dataset-stats-bar-chart" id="dataset-stats-bar-chart">
    </div>
    <div class="dataset-stats-bar-chart-legend">
        <div class="dataset-stats-bar-chart-legend-list" id="dataset-stats-bar-chart-legend-list">
        </div>
    </div>
</section>

<section>
    <h2 style="color: #007bff;">Recent Activity</h2>
    <ul class="dataset-stats-recent-activity-list">
        <li class="dataset-stats-recent-activity-item">
            <strong>New Component Added:</strong> Resistor 220Ω
        </li>
        <li class="dataset-stats-recent-activity-item">
            <strong>New Component Added:</strong> Capacitor 10µF
        </li>
        <li class="dataset-stats-recent-activity-item">
            <strong>Component Removed:</strong> LED Red
        </li>
    </ul>
</section>
`;

export function createComponentsStatsSection() {
    document.getElementById('right-section').innerHTML = dashboardHtml;
}

export function updateComponentsStats(componentsStats) {
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