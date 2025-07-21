export function initResize() {
    const resizer = document.getElementById('resizer');

    resizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    });
}

function resize(e) {
    const componentList = document.getElementById('component-list');
    let componentDetails = document.getElementById('component-details');
    if(componentDetails === null) {
        componentDetails = document.getElementById('dataset-stats-section');
    }
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