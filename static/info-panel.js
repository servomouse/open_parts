
// <section id="component-details">
    // <div class="component-info">
    //     <h2>Component Details</h2>
    //     <h3 id="component-name">10k Ohm Resistor</h3>
    //     <ul>
    //         <li>
    //             <strong class="component-info-field-name">Category:</strong>
    //             <span class="component-info-input-span">Resistor</span>
    //         </li>
    //         <li>
    //             <strong class="component-info-field-name">Value:</strong>
    //             <span class="component-info-input-span">10k</span>
    //         </li>
    //         <li>
    //             <strong class="component-info-field-name">Precision:</strong>
    //             <span class="component-info-input-span">1%</span>
    //         </li>
    //         <li>
    //             <strong class="component-info-field-name">Package:</strong>
    //             <span class="component-info-input-span">0603</span>
    //         </li>
    //         <li>
    //             <strong class="component-info-field-name">Technology:</strong>
    //             <span class="component-info-input-span">Film</span>
    //         </li>
    //         <li>
    //             <strong class="component-info-field-name">Amount Available:</strong>
    //             <span class="component-info-input-span">10</span>
    //         </li>
    //         <li>
    //             <strong class="component-info-field-name">Description:</strong>
    //             <span class="component-info-input-span">Standard 10k Ohm resistor.</span>
    //         </li>
    //         <li class="has-copy-symbol">
    //             <strong class="component-info-field-name">KiCAD footprint:</strong>
    //             <span class="component-info-input-span">path/to/footprint</span>
    //             <span class="copy-symbol" onclick="copyToClipboard(this)" title="Copy to clipboard">&#10064;</span>
    //         </li>
    //         <li class="has-copy-symbol">
    //             <strong class="component-info-field-name">KiCAD symbol:</strong> 
    //             <span class="component-info-input-span">path/to/symbol</span>
    //             <span class="copy-symbol" onclick="copyToClipboard(this)" title="Copy to clipboard">&#10064;</span>
    //         </li>
    //         <li class="has-copy-symbol">
    //             <strong class="component-info-field-name">Image:</strong>
    //             <span class="component-info-input-span">path/to/image</span>
    //             <span class="copy-symbol" onclick="copyToClipboard(this)" title="Copy to clipboard">&#10064;</span>
    //         </li>
    //         <li class="has-copy-symbol">
    //             <strong class="component-info-field-name">3D model:</strong>
    //             <span class="component-info-input-span">path/to/3d_model</span>
    //             <span class="copy-symbol" onclick="copyToClipboard(this)" title="Copy to clipboard">&#10064;</span>
    //         </li>
    //     </ul>
    //     <button id="component-info-edit-button" onclick="toggleEdit()">Edit</button>
    // </div>
    // <div class="image-and-model-container">
    //     <div class="component-image">
    //         <img src="{{ url_for('static', filename='images/resistor_1w.jpg') }}" alt="10k Ohm Resistor" id="component-image">
    //     </div>
    //     <div class="component-3d-model" id="component-3d-model" style="border: 1px solid #ccc; padding: 10px; height: 200px;">
    //         <model-viewer src="{{ url_for('static', filename='3d_models/octal_socket.glb') }}" alt="3D model of 10k Ohm Resistor" auto-rotate camera-controls style="width: 100%; height: 100%; background-color: #909090;" exposure="0.5" >
    //         </model-viewer>
    //     </div>
    // </div>
// </section>

export function showComponentInfo(category, index, component) {
    const componentData = {
        "category": "Resistor",
        "value": "10k",
        "precision": "1%",
        "package": "0603",
        "technology": "Film",
        "amount available": 10,
        "description": "Standard 10k Ohm resistor.",
        "KiCAD footprint": "path/to/footprint",
        "KiCAD symbol": "path/to/symbol",
        "image": "static/images/resistor_1w.jpg",
        "3D model": "static/3d_models/octal_socket.glb"
    }
    const hasCopySymbolFields = ["KiCAD footprint", "KiCAD symbol", "3D model"];
    const baseUrl = "{{ url_for('static', filename='') }}";

    let oldInfoPanel = document.getElementById('component-details');
    if(oldInfoPanel === null) {
        oldInfoPanel = document.getElementById('dataset-stats-section');
    }
    const newSection = document.createElement('section');
    newSection.id = 'component-details';

    // Component info:
    const componentInfoDiv = document.createElement('div');
    componentInfoDiv.className = 'component-info';

        const componentHeader = document.createElement('h2');
        componentHeader.innerText = "Component Details";
        componentInfoDiv.appendChild(componentHeader);

        const componentName = document.createElement('h3');
        componentName.innerText = "10k Ohm Resistor";   // TODO: UpdateMe!
        componentInfoDiv.appendChild(componentName);

        const componentInfoTable = document.createElement('ul');

        for (const parameter in componentData) {
                const componentInfoTableItem = document.createElement('li');
                if(hasCopySymbolFields.includes(parameter)) {
                    componentInfoTableItem.className = 'has-copy-symbol';
                }
                const componentInfoTableItemStrong = document.createElement('strong');
                componentInfoTableItemStrong.className = 'component-info-field-name';
                componentInfoTableItemStrong.innerText = `${parameter}`;
                componentInfoTableItem.appendChild(componentInfoTableItemStrong);

                const componentInfoTableItemSpan = document.createElement('span');
                componentInfoTableItemSpan.className = 'component-info-input-span';
                componentInfoTableItemSpan.innerText = `${componentData[parameter]}`;
                componentInfoTableItem.appendChild(componentInfoTableItemSpan);

                if(hasCopySymbolFields.includes(parameter)) {
                    const copySymbolSpan = document.createElement('span');
                    copySymbolSpan.className = 'copy-symbol';
                    copySymbolSpan.title = 'Copy to clipboard';
                    copySymbolSpan.innerHTML = '&#10064;';
                    copySymbolSpan.onclick = function() { copyToClipboard(this); };
                    componentInfoTableItem.appendChild(copySymbolSpan);
                }

                componentInfoTable.appendChild(componentInfoTableItem);
            }

        componentInfoDiv.appendChild(componentInfoTable);

    newSection.appendChild(componentInfoDiv);

    // Image and 3D model:
    const imageModelContainer = document.createElement('div');
    imageModelContainer.className = 'image-and-model-container';

        const componentImageDiv = document.createElement('div');
        componentImageDiv.className = 'component-image-div';
            const componentImage = document.createElement('img');
            componentImage.src = componentData["image"];
            componentImage.className = 'component-image';
            componentImage.alt = '10k Ohm Resistor';    // TODO: UpdateMe!
            // componentImage.id = 'newImageId';
            componentImageDiv.appendChild(componentImage);
        imageModelContainer.appendChild(componentImageDiv);

        const componentModelDiv = document.createElement('div');
        componentModelDiv.className = 'component-3d-model';
            const modelViewer = document.createElement('model-viewer');
            modelViewer.setAttribute('src', componentData["3D model"]);
            modelViewer.setAttribute('alt', "3D model of 10k Ohm Resistor");
            modelViewer.setAttribute('auto-rotate', '');
            modelViewer.setAttribute('camera-controls', '');
            modelViewer.setAttribute('exposure', '0.5');
            componentModelDiv.appendChild(modelViewer);
        imageModelContainer.appendChild(componentModelDiv);

    newSection.appendChild(imageModelContainer);

    oldInfoPanel.parentNode.replaceChild(newSection, oldInfoPanel);
    // Force reflow
    newSection.offsetHeight; // Accessing this property forces a reflow
}
