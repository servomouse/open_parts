import { addComponent } from './components.js';
import { displayComponents } from './display_components.js';

function createForm(formType, label, name) {
    const formGroup = document.createElement('div');
    formGroup.classList.add("form-group");
    const newLabel = document.createElement('label');
    newLabel.textContent = label;
    newLabel.setAttribute("for", name);
    formGroup.appendChild(newLabel);

    if(formType==="textarea") {
        const textarea = document.createElement("textarea");

        // Set attributes for the textarea (optional)
        textarea.setAttribute("id", `add-component-form-${name}`);
        textarea.setAttribute("name", `add-component-form-${name}`);
        // textarea.setAttribute("rows", "5");
        // textarea.setAttribute("cols", "50");
        textarea.setAttribute("placeholder", "Short component description...");

        // textarea.value = "This is some initial text.";   // Set initial content (optional)

        formGroup.appendChild(textarea);
    } else {
        const inputElement = document.createElement('input');
        inputElement.type = formType;
        // inputElement.placeholder = 'Enter text here';
        inputElement.id = `add-component-form-${name}`;
        inputElement.name = `add-component-form-${name}`;
        formGroup.appendChild(inputElement);
    }

    return formGroup;
}

// Function to handle the form submission
async function handleAddComponent(componentCategory) {
    const formData = new FormData(document.getElementById('add-component-form'));
    // console.log(`KiCAD link: ${formData.get('add-component-form-kicad_links')}`);
    const newComponent = {
        category: componentCategory,
        name: formData.get('add-component-form-name') || '',
        case: formData.get('add-component-form-case') || '',
        value: formData.get('add-component-form-value') || '',
        precision: formData.get('add-component-form-precision') || '',
        voltage: formData.get('add-component-form-voltage') || '',
        technology: formData.get('add-component-form-technology') || '',
        description: formData.get('add-component-form-Description') || '',
        // image: formData.get('add-component-form-image'), // Handle file upload if needed
        // kicad_links: formData.get('add-component-form-kicad_links') ? formData.get('add-component-form-kicad_links').split(',') : [],
        // model: formData.get('add-component-form-model') || '',
        amount: parseInt(formData.get('add-component-form-amount'), 10) || 0
    };

    addComponent(componentCategory, newComponent);
    displayComponents(null); // Refresh the component list

    try {
        const response = await fetch('/api/components', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComponent),
        });

        console.log(`Response: ${response}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // const newComponent = await response.json();
        // console.log('Component added:', newComponent);
        // closeModal(); // Close the modal after adding the component
    } catch (error) {
        console.error('Error adding component:', error);
    }
    closeModal();
}

// Function to open the modal
export function openModal(componentCategory) {    // add-component-form-header
    console.log(`Creating new component of the ${componentCategory} type`);
    const addComponentForm = document.getElementById('add-component-form');
    const addComponentFormHeader = document.getElementById('add-component-form-header');
    addComponentForm.innerHTML = '';


    switch (componentCategory) {
        case "resistors":
            addComponentForm.appendChild(createForm("text", "Value:", "value"));
            addComponentForm.appendChild(createForm("text", "Precision:", "precision"));
            addComponentForm.appendChild(createForm("text", "Power disipation:", "power"));
            break;
        case "capacitors":
            addComponentForm.appendChild(createForm("text", "Value:", "value"));
            addComponentForm.appendChild(createForm("text", "Technology:", "technology"));
            addComponentForm.appendChild(createForm("text", "Voltage:", "voltage"));
            break;
        case "ics":
            addComponentForm.appendChild(createForm("text", "Name:", "name"));
            break;
        default:
            alert(`Error: Unknown component category: ${componentCategory}!`);
    }
    addComponentForm.appendChild(createForm("text", "Case:", "case"));

    // Common part:
    addComponentForm.appendChild(createForm("textarea", "Description:", "Description"));
    addComponentForm.appendChild(createForm("file", "Image:", "image"));
    addComponentForm.appendChild(createForm("file", "KiCAD Links:", "kicad_links"));
    addComponentForm.appendChild(createForm("file", "Model:", "model"));
    addComponentForm.appendChild(createForm("number", "Amount:", "amount"));

    // <button type="button" id="add-component-button" class="submit-button">Add</button>
    const addButton = document.createElement('button');
    addButton.classList.add("submit-button");
    addButton.textContent = 'Add';
    addButton.id = "add-component-button";
    addButton.addEventListener('click', (event) => {
        // alert('Button clicked!');
        event.preventDefault(); // Prevent default form submission
        handleAddComponent(componentCategory); // Call the function to handle adding the component
    });
    addComponentForm.appendChild(addButton);

    const modal = document.getElementById('add-component-modal');
    modal.style.display = 'block';  // Make the window visible
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('add-component-modal');
    modal.style.display = 'none';   // Hide the window
}

// Event listener for the close button
document.getElementById('close-modal').addEventListener('click', closeModal);