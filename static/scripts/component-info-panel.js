import { fetchComponents, upate_component, add_component } from './network.js';
import { updateComponents, getComponentsStats } from './components.js';
import { sortComponents } from './sorting.js';
import { displayComponents } from './components-table-panel.js';
import { updateComponentsStats, createComponentsStatsSection } from './components-stats.js';

let currentComponentId = 0;
let currentComponent = null;

function copyToClipboard(button) {
    const span = button.previousElementSibling;
    const tempInput = document.createElement('input');
    tempInput.value = span.innerText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    alert('Copied: ' + span.innerText);
}

async function toggleFields(editable) {
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
            input.className = 'component-info-input';
            input.id = span.id;
            
            // Remove the copy symbol
            const copySymbol = span.nextElementSibling;
            if (copySymbol && copySymbol.classList.contains('copy-symbol')) {
                copySymbol.remove();
            }
            
            // Replace the span with the input
            span.parentNode.replaceChild(input, span);
        });
    } else {
        const inputs = document.querySelectorAll('.component-info-input');
        inputs.forEach(input => {
        if (input) {
            const newSpan = document.createElement('span');
            newSpan.className = 'component-info-input-span';
            newSpan.innerText = input.value;
            newSpan.id = input.id;
            const key = newSpan.id.replace("component-info-input-", "");
            console.log(`Processing key: ${key}`);
            if(key === 'amount') {
                currentComponent[key] = parseInt(newSpan.innerText);
            } else {
                currentComponent[key] = newSpan.innerText;
            }
            
            // Replace the input with the new span
            input.parentNode.replaceChild(newSpan, input);

            if (newSpan.parentNode.classList.contains('has-copy-symbol')) {
                // Add the copy symbol back
                const copySymbol = document.createElement('span');
                copySymbol.className = 'copy-symbol';
                copySymbol.onclick = function() { copyToClipboard(this); };
                copySymbol.title = "Copy to clipboard";
                copySymbol.innerHTML = '&#10064;';
                
                // Insert the copy symbol after the new span
                newSpan.parentNode.insertBefore(copySymbol, newSpan.nextSibling);
            }
        }
        });
        console.log(`Current component ID: ${currentComponentId}`);
        if(currentComponentId === 0) {
            currentComponentId = await add_component(currentComponent);
            currentComponent['id'] = currentComponentId;
            console.log(`New component ID: ${currentComponentId}`);
        } else {
            await upate_component(currentComponent);
            if(currentComponent['amount'] === 0) {  // Component was deleted, show stats
                createComponentsStatsSection();
                updateComponentsStats(getComponentsStats());
                return;
            }
        }
        updateComponents(sortComponents(await fetchComponents()));
        displayComponents(null);
        showComponentInfo(currentComponent);
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

// Constants
const COMP_FIELDS = {
    "Resistors": ["value", "precision", "package", "technology", "description", "image", "kicad_footprint", "kicad_symbol", "model_3d", "amount"],
    "Capacitors": ["value", "voltage", "package", "technology", "description", "image", "kicad_footprint", "kicad_symbol", "model_3d", "amount"],
    "ICs": ["subcategory", "group_name", "name", "package", "technology", "description", "datasheet", "image", "kicad_footprint", "kicad_symbol", "model_3d", "amount"],
    "new": ["category", "subcategory", "group_name", "name", "package", "value", "precision", "voltage", "technology", "description", "image", "kicad_footprint", "kicad_symbol", "model_3d", "amount"],
    "default": ["category", "subcategory", "group_name", "name", "package", "value", "precision", "voltage", "technology", "description", "image", "kicad_footprint", "kicad_symbol", "model_3d", "amount"],
};
const COPY_SYMBOL_FIELDS = ["kicad_footprint", "kicad_symbol", "model_3d"];

// Main function
export function showComponentInfo(componentData) {
    initializeComponentInfo(componentData);
    const infoPanel = document.getElementById('right-section');
    
    const componentInfoSection = createComponentInfoSection(componentData, false);
    infoPanel.appendChild(componentInfoSection);
    
    const imageModelSection = createImageAndModelSection(componentData);
    infoPanel.appendChild(imageModelSection);
}

export function showAddComponentPanel(componentCategory) {
    const newComponentTemplate = {
        "id": 0,
        "category": componentCategory,
        "subcategory": "",
        "group_name": "",
        "name": "",
        "package": "",
        "value": "",
        "precision": "",
        "voltage": "",
        "technology": "",
        "description": "",
        "datasheet": "",
        "image": "static/images/default.jpg",
        "kicad_footprint": "",
        "kicad_symbol": "",
        "model_3d": "static/images/no_3d_model.png",
        "amount": 0,
    }
    initializeComponentInfo(newComponentTemplate);
    const infoPanel = document.getElementById('right-section');
    
    const componentInfoSection = createComponentInfoSection(newComponentTemplate, true);
    infoPanel.appendChild(componentInfoSection);
    
    const imageModelSection = createImageAndModelSection(newComponentTemplate);
    infoPanel.appendChild(imageModelSection);
    
    toggleEdit();
}

// Initialize component data and display panel
function initializeComponentInfo(componentData) {
    currentComponent = componentData;
    currentComponentId = componentData['id'];
    
    const infoPanel = document.getElementById('right-section');
    infoPanel.style.display = 'flex';
    infoPanel.innerHTML = '';
}

// Create the component info section
function createComponentInfoSection(componentData, isNew) {
    const componentInfoDiv = document.createElement('div');
    componentInfoDiv.className = 'component-info';
    
    if(isNew) {
        const header = createComponentInfoHeader(componentData, `Add new ${componentData['category'].slice(0, -1)}`);
        componentInfoDiv.appendChild(header);
    } else {
        const header = createComponentInfoHeader(componentData, "Component Details");
        componentInfoDiv.appendChild(header);
    }
    
    const infoList = createComponentInfoList(componentData);
    componentInfoDiv.appendChild(infoList);
    
    const editButton = createEditButton();
    componentInfoDiv.appendChild(editButton);
    
    return componentInfoDiv;
}

// Create the component info header
function createComponentInfoHeader(componentData, header) {
    const componentHeader = document.createElement('h2');
    componentHeader.innerText = header;
    
    const componentName = document.createElement('h3');
    componentName.innerText = componentData['description'];
    
    const headerContainer = document.createElement('div');
    headerContainer.appendChild(componentHeader);
    headerContainer.appendChild(componentName);
    
    return headerContainer;
}

// Create the component info list
function createComponentInfoList(componentData) {
    const componentInfoTable = document.createElement('ul');
    let key = "default";
    if(componentData['category'] in COMP_FIELDS) {
        key = componentData['category'];
    }
    
    for (const parameter of COMP_FIELDS[key]) {
        const hasCopyButton = COPY_SYMBOL_FIELDS.includes(parameter);
        const listItem = createComponentInfoListItem(
            parameter, 
            componentData[parameter], 
            hasCopyButton
        );
        componentInfoTable.appendChild(listItem);
    }
    
    return componentInfoTable;
}

// Create a single component info list item
function createComponentInfoListItem(parameter, value, hasCopyButton) {
    const componentInfoTableItem = document.createElement('li');
    
    if (hasCopyButton) {
        componentInfoTableItem.className = 'has-copy-symbol';
    }
    
    const fieldName = document.createElement('strong');
    fieldName.className = 'component-info-field-name';
    fieldName.innerText = parameter;
    componentInfoTableItem.appendChild(fieldName);
    
    const fieldValue = document.createElement('span');
    fieldValue.className = 'component-info-input-span';
    fieldValue.id = `component-info-input-${parameter}`;
    fieldValue.innerText = value;
    componentInfoTableItem.appendChild(fieldValue);
    
    if (hasCopyButton) {
        const copySymbol = document.createElement('span');
        copySymbol.className = 'copy-symbol';
        copySymbol.title = 'Copy to clipboard';
        copySymbol.innerHTML = '&#10064;';
        copySymbol.onclick = function() { copyToClipboard(this); };
        componentInfoTableItem.appendChild(copySymbol);
    }
    
    return componentInfoTableItem;
}

// Create the edit button
function createEditButton() {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.id = 'component-info-edit-button';
    editButton.onclick = () => {
        toggleEdit();
    };
    return editButton;
}

// Create the image and 3D model section
function createImageAndModelSection(componentData) {
    const imageModelContainer = document.createElement('div');
    imageModelContainer.className = 'image-and-model-container';

    const componentImage = createComponentImage(componentData, componentData["image"]);
    imageModelContainer.appendChild(componentImage);

    if(componentData['model_3d'] === "static/images/no_3d_model.png") {
        const componentImage = createComponentImage(componentData, componentData["model_3d"]);
        imageModelContainer.appendChild(componentImage);
    } else {
        const componentModel = createComponentModel(componentData);
        imageModelContainer.appendChild(componentModel);
    }
    
    return imageModelContainer;
}

// Create the component image
function createComponentImage(componentData, src) {
    const componentImageDiv = document.createElement('div');
    componentImageDiv.className = 'component-image-div';
    
    const componentImage = document.createElement('img');
    componentImage.src = src;
    componentImage.className = 'component-image';
    componentImage.alt = componentData['description'];
    
    componentImageDiv.appendChild(componentImage);
    return componentImageDiv;
}

// Create the 3D model viewer
function createComponentModel(componentData) {
    const componentModelDiv = document.createElement('div');
    componentModelDiv.className = 'component-3d-model';
    
    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('src', componentData["model_3d"]);
    modelViewer.setAttribute('alt', "3D model of the component");
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('exposure', '0.5');
    
    componentModelDiv.appendChild(modelViewer);
    return componentModelDiv;
}
