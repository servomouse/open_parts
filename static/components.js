let components = null;

export function updateComponents(newComponents) {
    components = newComponents;
}

export function updateComponent(category, index, field, newValue) {
    components[category][index][field] = newValue;
}

export function addComponent(category, description) {
    console.log(`Adding a new component of type ${category}: ${JSON.stringify(description, null, 2)}`);
    if(!(category in components)) {
        components[category] = [];
    }
    components[category].push(description);
}

export function getComponents() {
    return components;
}
