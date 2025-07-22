// Function to convert resistor value to a numerical value for sorting
function parseResistorValue(value) {
    const multiplierMap = {
        'm': 1e-3, // milliOhms
        'R': 1,    // Ohms
        '': 1,     // Ohms (no letter)
        'k': 1e3,  // KiloOhms
        'M': 1e6   // MegaOhms
    };

    // Extract the numeric part and the multiplier
    const match = value.match(/^(\d+)([mRkM]?)$/);
    if (match) {
        const numValue = parseFloat(match[1]);
        const multiplier = match[2];
        return numValue * (multiplierMap[multiplier] || 1);
    }
    return Infinity; // Return a high value for invalid entries
}

// Function to sort resistors by value and case
function sortResistors(resistors) {
    return resistors.sort((a, b) => {
        const valueA = parseResistorValue(a.value);
        const valueB = parseResistorValue(b.value);

        // First, compare by value
        if (valueA !== valueB) {
            return valueA - valueB; // Ascending order
        }

        // If values are the same, compare by case
        return a.case.localeCompare(b.case);
    });
}

// Function to convert capacitor value to a numerical value for sorting
function parseCapacitorValue(value) {
    const multiplierMap = {
        'pF': 1e-12, // picoFarads
        'nF': 1e-9,  // nanoFarads
        'uF': 1e-6,  // microFarads
        'mF': 1e-3,  // milliFarads
        'F': 1       // Farads
    };

    // Extract the numeric part and the multiplier
    const match = value.match(/^(\d+(\.\d+)?)([pnu]F|mF|F)?$/);
    if (match) {
        const numValue = parseFloat(match[1]);
        const multiplier = match[3] || ''; // Default to empty string if no multiplier
        return numValue * (multiplierMap[multiplier] || 1);
    }
    return Infinity; // Return a high value for invalid entries
}

// Function to sort capacitors by value, voltage, and case
function sortCapacitors(capacitors) {
    return capacitors.sort((a, b) => {
        const valueA = parseCapacitorValue(a.value);
        const valueB = parseCapacitorValue(b.value);

        // First, compare by value
        if (valueA !== valueB) {
            return valueA - valueB; // Ascending order
        }

        // If values are the same, compare by voltage
        if (a.voltage !== b.voltage) {
            return parseInt(a.voltage) - parseInt(b.voltage); // Assuming voltage is in a comparable format
        }

        // If voltages are the same, compare by case
        return a.case.localeCompare(b.case);
    });
}

function sortICs(ics) {
    return ics.sort((a, b) => {
        // First, compare by name
        const nameComparison = a.name.localeCompare(b.name);
        if (nameComparison !== 0) {
            return nameComparison; // Ascending order
        }

        // If names are the same, compare by case
        return a.case.localeCompare(b.case);
    });
}

function defaultSort(components) {
    // Default sorting function
    return components;
}

export function sortComponents(components) {
    // Sort categories alphabetically
    const sortedCategories = Object.keys(components).sort();
    const sortFunctions = {
        "resistors": sortResistors,
        "capacitors": sortCapacitors,
        "ics": sortICs,
    }

    const sortedComponents = {};
    sortedCategories.forEach(category => {
        if(category in sortFunctions) {
            sortedComponents[category] = sortFunctions[category](components[category]);
        }
        else {
            console.log(`Sorting function for ${category} isn't implemented!`);
            sortedComponents[category] = defaultSort(components[category]);
        }
    });

    return sortedComponents;
}

// Example usage
// const sortedData = sortComponents(components_data);